import React, { Component } from "react";
import { Card, PieChartCard } from "../../components/Card";
import { Col, Row, Wrapper } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import DeleteBtn from "../../components/DeleteBtn";
import moment from "moment";
import API from "../../utils/API";
import "./Organizer.css";
import { app } from "../../config";

class Organizer extends Component {
  state = {
    data: [
      { title: "Data 1", value: 100, color: "red" },
      { title: "Data 2", value: 60, color: "blue" },
      { title: "Data 3", value: 30, color: "green" },
      { title: "Data 4", value: 20, color: "orange" },
      { title: "Data 5", value: 10, color: "grey" }
    ],
    upcomingBills: [],
    email: ""
  };
  // When the component mounts, load all the bills into the calender
  componentDidMount() {
    this.getUpcomingBills();
    this.getSpendingItems();
  }

  // Loads all the upcomingBills into the calender
  getUpcomingBills = () => {
    API.getBills()
      .then(res => {
        const upcoming = [];
        console.log(res.data);

        //will loop through bills for particular user and show bill due in future
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].email === this.state.email) {
            if (moment(res.data[i].dueDate).isAfter()) {
              upcoming.push(res.data[i]);
            }
          }
        }
        this.setState({ upcomingBills: upcoming });
      })
      .catch(err => console.error(err));
  };

  // Delete a upcoming bill from database
  deleteBillItem = id => {
    API.deleteBill(id)
      .then(res => this.getUpcomingBills())
      .catch(err => console.log(err));
  };

  // Loads all the spending items into the pie chart
  getSpendingItems = () => {
    API.getAllSpending()
      .then(res => {        
        const color = ["red","blue","green","orange","grey","purple","yellow","pink","grey","magenta","brown"];
        const categoryObjects = [];
        let values = {
          Car: 0,
          Emergency: 0,
          Family: 0,
          Food: 0,
          Gifts: 0,
          Investment: 0,
          Misc: 0,
          Shopping: 0,
          Vacation: 0,
          Work: 0,
          Entertainment: 0
        };
        let counter = 0;

        //this loop adds the dollar amount spend to the respective categories
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].email === this.state.email) {
            if (res.data[i].category in values) {
              values[res.data[i].category] += res.data[i].amount;
            }
          }
        }

        //for every key value pair in values array create an object for the data state
        for (var val in values) {
          let obj = {};
          obj["title"] = val.toString() + ": $" + values[val];
          obj["value"] = values[val];
          obj["color"] = color[counter];
          console.log(obj);
          categoryObjects.push(obj);
          counter++;
        }

        //assign categoryObjects to the data state
        this.setState({ data: categoryObjects });
      })
      .catch(err => console.error(err));
  };

  handleFormSubmit = event => {
    event.preventDefault();
  };

  //checks which user is logged in
  componentWillMount() {
    app.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          authenticated: true,
          email: user.email
        });
      }
    });
  }

  render() {
    return (
      <Wrapper>
        <Row>
          <Col size="4">
            <Card title="Income" body1="$2480.00" />
            <Card
              title="Amount Saved (current month)"
              body1={this.state.savings}
              body2="$580.00"
            />
          </Col>
          <Col size="4">
            <PieChartCard
              title="Spending"
              cardCategory=""
              data={this.state.data}
            />
          </Col>
          <Col size="4">
            <Card title="Upcoming Bills" />
            <List>
              {this.state.upcomingBills.map(bill => (
                <ListItem
                  key={bill._id}
                  heading={bill.payee}
                  category={bill.category}
                  amount={bill.amount}
                  date={moment(bill.dueDate).format("MM-DD-YY")}
                >
                  <DeleteBtn onClick={() => this.deleteBillItem(bill._id)} />
                </ListItem>
              ))}
            </List>
          </Col>
        </Row>
      </Wrapper>
    );
  }
}

export default Organizer;
