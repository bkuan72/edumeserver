/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-prototype-builtins */

import SysEnv from "./SysEnv";

/* eslint-disable @typescript-eslint/no-explicit-any */
export enum DateAddIntervalEnum {
  YEAR,
  QUARTER,
  MONTH,
  WEEK,
  DAY,
  HOUR,
  MINUTE,
  SECOND,
  MILLISECOND,
}
export class CommonFn {

  /**
  * This function adds a new property to obj object
  * @param obj - target obj
  * @param fieldName - new property name
  * @param dflt - default value of property
  */
  static defineProperty(obj: any, fieldName: string, dflt: any) {
      return Object.defineProperty(obj, fieldName, {
          value: dflt,
          writable: true,
          configurable: true,
          enumerable: true,
      });
  }


  static strWrapper = (val: string): string => {
    return "'" + val + "'";
  };

  static map = (mapTo: any, mapFrom: any): any => {
    for (const prop in mapTo) {
      if (CommonFn.hasProperty(mapFrom, prop)) {
        mapTo[prop] = mapFrom[prop];
      }
    }
    return mapTo;
  };

  static isEmpty = (val: string): boolean => {
    let isEmpty = false;
    if (CommonFn.isString(val)) {
      if (val === undefined) {
        isEmpty = true;
      }
      if (!isEmpty && val === null) {
        isEmpty = true;
      }
      if (!isEmpty && val.trim() === '') {
        isEmpty = true;
      }
    } else {
      isEmpty = true;
    }

    return isEmpty;
  };

  static hasProperty = (obj: any, prop: string): boolean => {
    let found = false;
    for (const key in obj) {
      if (key === prop) {
        found = true;
      }
    }
    return found;
  };


  static isUndefined (obj: any) {
    return obj === undefined;
  }

  static isString(obj: any) {
    return typeof(obj) === 'string';
  }


    /**
     * Adds time to a date. Modelled after MySQL DATE_ADD function.
     * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
     * https://stackoverflow.com/a/1214753/18511
     *
     * @param date  Date to start with
     * @param interval  One of: year, quarter, month, week, day, hour, minute, second
     * @param units  Number of units of the given interval to add.
     */
    static _dateAdd(date: Date, interval: DateAddIntervalEnum, units: number): Date {
      if (!(date instanceof Date)) {
          return new Date();
      }
      // don't change original date
      const ret = new Date(date);
      const checkRollover = () => {
          if (ret.getDate() !== date.getDate()) {
              ret.setDate(0);
          }
      };
      let addMillisec = 0;
      let daysFraction = 0;
      let adjDays = 0;
      switch (interval) {
          case DateAddIntervalEnum.YEAR:
              ret.setFullYear(ret.getFullYear() + units);
              checkRollover();
              break;
          case DateAddIntervalEnum.QUARTER:
              ret.setMonth(ret.getMonth() + 3 * units);
              checkRollover();
              break;
          case DateAddIntervalEnum.MONTH:
              ret.setMonth(ret.getMonth() + units);
              checkRollover();
              break;
          case DateAddIntervalEnum.WEEK:
              ret.setDate(ret.getDate() + 7 * units);
              break;
          case DateAddIntervalEnum.DAY:
              ret.setDate(ret.getDate() + units);
              break;
          case DateAddIntervalEnum.HOUR:
              daysFraction = units / 24;
              addMillisec = units * 3600000;
              if (daysFraction >= 1.0) {
                adjDays = parseInt(daysFraction.toFixed(0));
                ret.setDate(ret.getDate() + adjDays);
                addMillisec -= (adjDays * (8640000));
              }

              ret.setTime(ret.getTime() + addMillisec);
              break;
          case DateAddIntervalEnum.MINUTE:
              daysFraction = units / 1440;
              addMillisec = units * 60000;
              if (daysFraction >= 1.0) {
                adjDays = parseInt(daysFraction.toFixed(0));
                ret.setDate(ret.getDate() + adjDays);
                addMillisec -= (adjDays * (8640000));
              }
              ret.setTime(ret.getTime() + addMillisec);
              break;
          case DateAddIntervalEnum.SECOND:
              daysFraction = units / 86400;
              addMillisec = units * 1000;
              if (daysFraction >= 1.0) {
                adjDays = parseInt(daysFraction.toFixed(0));
                ret.setDate(ret.getDate() + adjDays);
                addMillisec -= (adjDays * (8640000));
              }
              ret.setTime(ret.getTime() + addMillisec);
              break;
          case DateAddIntervalEnum.MILLISECOND:
              daysFraction = units / 86400000;
              addMillisec = units;
              if (daysFraction >= 1.0) {
                adjDays = parseInt(daysFraction.toFixed(0));
                ret.setDate(ret.getDate() + adjDays);
                addMillisec -= (adjDays * (8640000));
              }
              ret.setTime(ret.getTime() + addMillisec);
              break;
          default:
              break;
      }
      return ret;
  }

  /**
   * Adds time to a date. Modelled after MySQL DATE_ADD function.
   * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
   * https://stackoverflow.com/a/1214753/18511
   *
   * @param date  Date to start with
   * @param interval  One of: year, quarter, month, week, day, hour, minute, second
   * @param units  Number of units of the given interval to add.
   */
  static dateAdd(date: Date, interval: DateAddIntervalEnum, units: number): Date {
    return CommonFn._dateAdd(date, interval, units);
  }

  /**
   * Subtract time from a date. Modelled after MySQL DATE_ADD function.
   * Example: dateAdd(new Date(), 'minute', 30)  //returns 30 minutes from now.
   * https://stackoverflow.com/a/1214753/18511
   *
   * @param date  Date to start with
   * @param interval  One of: year, quarter, month, week, day, hour, minute, second
   * @param units  Number of units of the given interval to add.
   */
  static dateDeduct(date: Date, interval: DateAddIntervalEnum, units: number): Date {
    return CommonFn._dateAdd(date, interval, units * -1);
  }

  /**
   * Check if char is a upper case
   * @param str input string
   * @returns true if case is upper
   */
  static isUpper(str: string): boolean {
    return !/[a-z]/.test(str) && /[A-Z]/.test(str);
  }

  /**
   *
   * Convert camel case string to snake case string eg camelCase, CamelCase to camel_case
   * @static
   * @param {string} str input string
   * @param {boolean} [useCamelCase] - use to override the environment variable
   * @return {*}  {string} - snake case string eg camel_case
   * @memberof CommonFn
   */
  static toSnakeCase(str: string, useCamelCase?: boolean): string  {
    // convert string to snake case if CAMEL_CASE_DTO environment is Y
      if (useCamelCase === undefined) {
        if (SysEnv.CAMEL_CASE_DTO !== 'Y') {
          return str;
        }
      } else {
        if (useCamelCase === false) {
          return str;
        }
      }
      return str.split(/(?=[A-Z0-9])/).join('_').toLowerCase();
  }

  /**
   * convert snake case string to camel case string camel_case  to camelCase
   *
   * @static
   * @param {string} str input string
   * @param {boolean} [useCamelCase] - use to override the environment variable
   * @return {*} camel case string eg camelCase
   * @memberof CommonFn
   */
  static toCamelCase(str: string, useCamelCase?: boolean): string
  {
    // convert string to camel case if CAMEL_CASE_DTO environment is Y
    if (useCamelCase === undefined) {
      if (SysEnv.CAMEL_CASE_DTO !== 'Y') {
        return str;
      }
    } else {
      if (useCamelCase === false) {
        return str;
      }
    }
    return str.replace(/([-_ ][a-z0-9])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '')
        .replace(' ', '');
    });
  }


/**
 * Convert date to mySQL formatted date
 * @param dt date object
 * @returns mySql date format '2021-11-29 05:00:000'
 */
   static toMySqlDate(dt: Date) {
    return dt.toISOString().split('T')[0];
  }

/**
 * Convert date to mySQL formatted date time
 * @param dt date object
 * @returns mySql date format '2021-11-29 05:00:000'
 */
   static toMySqlDateTime(date: Date) {
    return date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
  }

  /**
   * This convert a date string as define by dateFmt into JS Date
   * @param dateStr - date string 'xx/xx/xxxx' or 'xx/xx/xx'
   * @param dateFmt 
   * @returns 
   */
  static parseDate(dateStr: string, dateFmt: string) {
    let formattedDate = new Date('0000-00-00');
    let delimiter = '';
    let i;
    for (i = 0; i < dateFmt.length; i++) {
      if (dateFmt[i] != 'd' &&
          dateFmt[i] != 'M' &&
          dateFmt[i] != 'y') {
            delimiter = dateFmt[i];
            break;
          }
    }
    let dd: number | undefined;
    let MM: number | undefined;
    let yyyy: number | undefined;
    let yy: number | undefined;
    let day: number | undefined;
    let month: number | undefined;
    let year: number | undefined;
    const fmtArray  = dateFmt.split(delimiter);
    const dateArray = dateStr.split(delimiter);
    fmtArray.forEach((fmt, idx) => {
      if (fmt === 'dd') {
        dd = idx;
      } else {
        if (fmt === 'MM') {
          MM = idx;
        } else {
          if (fmt === 'yyyy') {
            yyyy = idx
          } else {
            if (fmt === 'yy') {
              yy = idx;
            }
          }
        }
      }
    })
    dateArray.forEach((dt, idx) => {
      if (idx === dd) {
        day = parseInt (dt);
      } else {
        if (idx === MM) {
          month = parseInt(dt);
        } else {
          if (yyyy && idx === yyyy) {
            year = parseInt(dt);
          } else {
            if (yy && idx === yy) {
              year = 2000 + parseInt(dt);
            }
          }
        }
      }
    })
    if (year !== undefined && month !== undefined && day !== undefined)
      formattedDate = new Date(Date.UTC(year, month, day));
    return formattedDate;
  }

/**
 * This convert a string date to date
 * @param dateStr - string date
 * @returns 
 */
 static stringDateToMySqlDate(dateStr: string) {
  const dt = new Date(dateStr);
  return this.toMySqlDate(dt);
}
}

export default CommonFn;
