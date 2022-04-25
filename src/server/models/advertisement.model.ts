import { CommonFn } from './../../modules/CommonFnModule';
import { AdvertisementData } from './../../schemas/advertisements.schema';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { advertisements_schema, advertisements_schema_table } from '../../schemas/advertisements.schema';
import { AdvertisementDTO } from '../../dtos/advertisements.DTO';
import { EntityModel } from './entity.model';
import SqlFormatter from '../../modules/sql.strings';
import SysLog from '../../modules/SysLog';
import appDbConnection from '../../modules/AppDBModule';
import SqlStr = require('sqlstring');
import e = require('express');
import DTOGenerator from '../../modules/ModelGenerator';

export interface FilterIfc {
  categories: string[];
  age_groups: string[];
  keywords:   string[];
  date_range: string[];
  date_array: string[];
  price_range: number[];
  locations: string[];
}

export class AdvertisementModel extends EntityModel {
  constructor (altTable?: string) {
    super();

    if (altTable) {
      super(altTable);
    } else  {
      this.tableName = advertisements_schema_table;
    }
    this.requestDTO = AdvertisementDTO;
    this.responseDTO = AdvertisementDTO;
    this.schema = advertisements_schema;
  }

  filterPass = (filter: FilterIfc, respEntityDTO: AdvertisementData): AdvertisementData =>  {
    let matchPoints = 0;
    filter.categories.forEach((category) => {
      if (respEntityDTO.categories.includes(category)) {
        matchPoints++;
      }
    });
    if (CommonFn.isEmpty(respEntityDTO.adAgeGroups)) {
      matchPoints++;
    } else {
      filter.age_groups.forEach((ageGroup) => {
        if (respEntityDTO.ageGroups.includes(ageGroup)) {
          matchPoints++;
        }
      });
    }
    filter.keywords.forEach((keyword) => {
      if (respEntityDTO.keywords.includes(keyword)) {
        matchPoints++;
      }
    });
    // if (CommonFn.isEmpty(respEntityDTO.start_date) &&
    //     CommonFn.isEmpty(respEntityDTO.end_date)) {
    //       matchPoints++;
    //     } else {
    //       if (filter.date_range.length > 0) {
    //         filter.date_range.forEach((filterDate) => {
    //         });
    //       } else {
    //         matchPoints++;
    //       }
    //     }

    respEntityDTO = DTOGenerator.defineProperty(respEntityDTO, 'matchPoints', matchPoints);
    return respEntityDTO;
  }
  findKeyword = (
    siteCode: string,
    searchStr: string,
    filter: FilterIfc,
    ignoreExclSelect?: boolean,
    excludeSelectProp?: string[]
  ): Promise<any[]> => {
    const nowDate = new Date();
    const respEntityDTOArray: any[] = [];
    const nowDateStr = SqlStr.escape(nowDate.toISOString());
    let sql = SqlFormatter.formatSelect(
      this.tableName,
      this.schema,
      ignoreExclSelect,
      excludeSelectProp
    );
    sql += ' WHERE site_code='+SqlStr.escape(siteCode) + ' AND ';
    sql += ' status != ' + SqlStr.escape('DELETED') + ' AND ';
    sql += ' ((start_date = ' + SqlStr.escape('') + ' AND ';
    sql += ' end_date = ' + SqlStr.escape('') + ') OR ';
    sql += ' (start_date <= ' + nowDateStr + ' AND ';
    sql += ' end_date >= ' + nowDateStr + ')';
    sql += ');';
    return new Promise((resolve) => {
      appDbConnection.select(sql)
      .then((result) => {

        if (result.rows.length) {
          result.rows.forEach((rowData: any) => {
            const data = SqlFormatter.transposeResultSet(this.schema,
              ignoreExclSelect,
              undefined,
              rowData,
              undefined,
              excludeSelectProp
              );
            let respEntityDTO = new this.responseDTO(data) as AdvertisementData;
            if (CommonFn.isEmpty(searchStr) ||
                respEntityDTO.header.contain(searchStr) ||
                respEntityDTO.sub_header.contain(searchStr) ) {
                  if (filter) {
                    respEntityDTO = this.filterPass(filter, respEntityDTO);
                    if (respEntityDTO.matchPoints > 0) {
                      respEntityDTOArray.push(respEntityDTO);
                    }
                  } else {
                    respEntityDTOArray.push(respEntityDTO);
                  }
            }
          });
          resolve(respEntityDTOArray);
          return;
        } else {
        // not found with the id
        resolve(respEntityDTOArray);
        }

      })
      .catch((err) => {
        SysLog.error(JSON.stringify(err));
        resolve(respEntityDTOArray);
        return;
      });
      });
  }

  }
