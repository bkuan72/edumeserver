/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */




export class CommonFn {
    static  strWrapper = (val: string): string => {
        return "'"+val+"'";
    }

    static map = (mapTo: any, mapFrom: any): any => {
        for (const prop in mapTo) {
            if (CommonFn.hasProperty(mapFrom, prop)) {
                mapTo[prop] = mapFrom[prop];
            }
        }
        return mapTo;
    }

    static isEmpty = (val: string): boolean => {
        let isEmpty = false;
        if (val === undefined) {
          isEmpty = true;
        }
        if (!isEmpty && val === null) {
          isEmpty = true;
        }
        if (!isEmpty && val.trim() === '') {
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
      }

      static addMinutesToDate(minutes: number, beforeTime: Date){
        const ONE_MINUTE_IN_MILLISEC = 60000;//millisecs

        const curTimeInMs = beforeTime.getTime();
        const afterAddingMins = new Date(curTimeInMs + (minutes * ONE_MINUTE_IN_MILLISEC));
        return afterAddingMins;
    }
}

export default CommonFn;
