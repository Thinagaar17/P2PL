import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import { Icon } from "react-native-elements";

export default class ExampleFour extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ["Index", "File Name", "File Size", "Options"],
      tableData: [
        ["1", "2", "3", "4"],
        ["2", "b", "c", "d"],
        ["3", "2", "3", "4"],
        ["4", "b", "c", "d"],
      ],
    };
  }

  share() {
    console.log(23);
  }

  delete() {
    console.log(24);
  }

  render() {
    const state = this.state;
    const element = (data, index) => (
      <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
        <TouchableOpacity onPress={() => this.share(index)}>
          <Icon name="share-social" type="ionicon" size={25} Color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.delete(index)}>
          <Icon name="trash" type="ionicon" size={25} Color="#000" />
        </TouchableOpacity>
      </View>
    );

    return (
      <View style={styles.container}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 20,
          }}
        >
          <Text style={styles.title}>Inventory</Text>
        </View>
        <Table borderStyle={{ borderColor: "transparent" }}>
          <Row
            data={state.tableHead}
            style={styles.head}
            textStyle={styles.text}
          />
          {state.tableData.map((rowData, index) => (
            <TableWrapper key={index} style={styles.row}>
              {rowData.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  data={cellIndex === 3 ? element(cellData, index) : cellData}
                  textStyle={styles.text}
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            style={styles.blogout}
            onPress={() => uploadImage()}
          >
            <Text style={styles.Ltext}>Upload File</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#140F38", justifyContent: "center",paddingHorizontal:20 },
  head: { height: 40, backgroundColor: "#808B97" },
  text: { margin: 6 },
  row: { flexDirection: "row", backgroundColor: "#FFF1C1" },
  btn: { width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2 },
  btnText: { textAlign: "center", color: "#fff" },
  blogout: {
    width: 160,
    height: 40,
    backgroundColor: "#E3562A",
    borderColor: "#E3562A",
    borderRadius: 16,
    marginTop: 20,
  },

  Ltext: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 18,
    justifyContent: "space-between",
    paddingTop: 8,
  },
  title: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins",
    fontWeight: "700",
    fontSize: 35,
    justifyContent: "space-between",
    paddingTop: 8,
  },
});
