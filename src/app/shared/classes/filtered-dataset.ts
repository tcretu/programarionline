import { MatTableDataSource } from "@angular/material/table";

export class FilteredDataset{
  displayedColumnsExt: string[]=[]
  filterSelectObj:any =this.displayedColumnsExt.map(column=>{return {name:column, columnProp:column,options:[]}});
  filterValue:string='';
  dataSource= new MatTableDataSource();
  dataSet:any[]=[];
  filterValues:any = {};

  // filtering utils
  getFilterObjectByName(name:string){
  let filterObj= this.filterSelectObj.filter((data:any)=>{return data.name==name});
  if(filterObj.length == 0){
    return null;
  }
  let filtered=filterObj[0];
  filtered.options=filtered.options.sort();
  return filtered;
}

// filtering utils
getFilterObject(fullObj: any[], key:any) {
  const uniqChk:string[] = [];
  fullObj.filter((obj: { [x: string]: string; }) => {
    if (!uniqChk.includes(obj[key])) {
      uniqChk.push(obj[key]);
    }
    return obj;
    });
  return uniqChk;
}



applyFilter(event: Event) {
  this.filterValue = (event.target as HTMLInputElement).value.trim();
  if(this.filterValue ==''){
    this.dataSource.data=this.dataSet;
  }else{
    this.dataSource.data=(this.dataSet.filter((filterV)=>{
      return JSON.stringify(Object.values(filterV)).toLowerCase().indexOf(this.filterValue.toLowerCase())>=0;
    }) ) ;
  }
}

createFilter() {
let filterFunction = (data: any, filter: string): boolean =>{
  let searchTerms = JSON.parse(filter);
  let isFilterSet = false;
  for (const col in searchTerms) {
    if (searchTerms[col].toString() !== '') {
      isFilterSet = true;
    }else {
      delete searchTerms[col];
    }
  }

  let nameSearch = () => {
    let found = false;
    if (isFilterSet) {
      for (const col in searchTerms) {
        if((data[col]!=null)&&(data[col].toString().toLowerCase().indexOf(searchTerms[col].trim().toLowerCase())!=-1)){
          found = true;
        }
        /*
        searchTerms[col].trim().toLowerCase().split(' ').forEach((word: any) => {
          if ((data[col]!=null) && (data[col].toString().toLowerCase().indexOf(word) != -1 && isFilterSet)) {
            found = true
          }
        });
        */
      }
      return found;
    } else {
      return true;
    }
  }
  return nameSearch();
}
return filterFunction
}


filterChange(filter:any, event:any) {
  this.filterValues[filter.columnProp] = event.value != null? event.value.toString().trim().toLowerCase():'';
  this.dataSource.filter = JSON.stringify(this.filterValues)
}

resetFilters() {
  this.filterValues = {}
  this.filterSelectObj.forEach((value:any, key:any) => {
    value.modelValue = undefined;
  })
  this.dataSource.filter = "";
}

}
