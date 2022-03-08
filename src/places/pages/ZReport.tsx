import * as React from "react";
import { ReactGrid, Column, Row } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import {supabase} from "../../shared/util/supabase"

interface Person {
  name: string;
  surname: string;
}




const getSesions = async() =>{
  const { data, error } = await supabase
.from('sessions')
.select('*')
  console.log(error)
  console.log("LLLLLL")
  console.log(data)
}

const getPeople = (): Person[] => [
  { name: "Thomas", surname: "Goldman" },
  { name: "Susie", surname: "Quattro" },
  { name: "", surname: "" }
];

const getColumns = (): Column[] => [
  { columnId: "name", width: 150 },
  { columnId: "surname", width: 150 }
];

const headerRow: Row = {
  rowId: "header",
  cells: [
    { type: "header", text: "Name" },
    { type: "header", text: "Surname" }
  ]
};


const getRows = (people: Person[]): Row[] => [
  headerRow,
  ...people.map<Row>((person, idx) => ({
    rowId: idx,
    cells: [
      { type: "text", text: person.name },
      { type: "text", text: person.surname }
    ]
  }))
];

 

  function Zreport() {
    const [people] = React.useState<Person[]>(getPeople());
    const rows = getRows(people);
    const columns = getColumns();
    getSesions();
    return <ReactGrid rows={rows} columns={columns} />;
  }
  
  export default Zreport;