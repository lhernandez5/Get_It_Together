import React, { Component } from "react";
import { Card, PieChartCard } from "../../components/Card";
import { Col, Row, Wrapper } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import DeleteBtn from "../../components/DeleteBtn";
import moment from "moment";
import API from "../../utils/API";
import "./Organizer.css";
import { app } from "../../config";
import { Input, FormBtn } from "../../components/Form";

class Organizer extends Component {
  state = {
    spendingPieChart: [],
    billsPieChart: [],
    upcomingBills: [],
    email: "",
    monthlyIncome: [0],
    amount: "",
    date: "",
    spendingTotal: 0,
    billsTotal: 0,
    totalOfAllSpent: 0,
    month: moment()
      .subtract(0, "month")
      .startOf("month")
      .format("MMMM")
  };

  // When the component mounts, load all the bills into the calender
  componentDidMount() {
    this.getUpcomingBills();
    this.getSpendingItems();
    this.loadIncome();
  }

  // Loads all the upcomingBills into the calender
  getUpcomingBills = () => {
    API.getBills()
      .then(res => {
        const userUpcomingBills = [];
        let totalOfBills = 0;
        const color = [
          "red",
          "blue",
          "green",
          "orange",
          "grey",
          "purple",
          "yellow",
          "pink",
          "grey",
          "magenta",
          "brown"
        ];
        const categoryObject = [];
        let categoryValues = {
          Car_Payment: 0,
          Childcare: 0,
          Gas: 0,
          Health_and_Fitness: 0,
          Insurance: 0,
          Medical: 0,
          Misc: 0,
          Personal_Care: 0,
          Phone: 0,
          Rent: 0,
          Utilities: 0
        };
        let counter = 0;

        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].email === this.state.email) {
            if (res.data[i].category in categoryValues) {
              //added if statement to check for upcoming bills
              if (
                moment(res.data[i].dueDate)
                  .startOf("month")
                  .format("MMMM") ===
                moment()
                  .startOf("month")
                  .format("MMMM")
              ) {
                categoryValues[res.data[i].category] += res.data[i].amount;
                totalOfBills += res.data[i].amount;
                
                if (moment().isBefore(moment(res.data[i].dueDate))) {
                  userUpcomingBills.push(res.data[i]);
                }
              }
            }
          }
        }
        this.setState({ billsTotal: totalOfBills });
        this.setState({ upcomingBills: userUpcomingBills });
        this.setState({
          totalOfAllSpent: this.state.totalOfAllSpent + this.state.billsTotal
        });
        for (var val in categoryValues) {
          let billPieChartSlice = {};
          billPieChartSlice["title"] =
            val.toString() + ": $" + categoryValues[val];
          billPieChartSlice["value"] = categoryValues[val];
          billPieChartSlice["color"] = color[counter];
          categoryObject.push(billPieChartSlice);
          counter++;
        }

        this.setState({ billsPieChart: categoryObject });
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
        const color = [
          "red",
          "blue",
          "green",
          "orange",
          "grey",
          "purple",
          "yellow",
          "pink",
          "grey",
          "magenta",
          "brown"
        ];
        const categoryObjects = [];
        let categoryValues = {
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
        let total = 0;
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].email === this.state.email) {
            if (res.data[i].category in categoryValues) {
              if (
                moment(res.data[i].date)
                  .subtract(0, "month")
                  .startOf("month")
                  .format("MMMM") ===
                moment()
                  .subtract(0, "month")
                  .startOf("month")
                  .format("MMMM")
              ) {
                total += res.data[i].amount;
                categoryValues[res.data[i].category] += res.data[i].amount;
              }
            }
          }
        }
        this.setState({ spendingTotal: total });

        //for every key value pair in values array create an object for the data state
        for (var val in categoryValues) {
          let spendingPieChartSlice = {};
          spendingPieChartSlice["title"] =
            val.toString() + ": $" + categoryValues[val];
          spendingPieChartSlice["value"] = categoryValues[val];
          spendingPieChartSlice["color"] = color[counter];

          categoryObjects.push(spendingPieChartSlice);
          counter++;
        }

        //assign categoryObjects to the data state
        this.setState({ spendingPieChart: categoryObjects });
      })
      .catch(err => console.error(err));
  };

  handleFormSubmit = event => {
    event.preventDefault();
  };

  //get the income from incomes db
  loadIncome = () => {
    API.getIncomes()
      .then(res => {
        const filteredIncome = [];
        //Here I added the formula to assign each user with their spending
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].email === this.state.email) {
            filteredIncome.push(res.data[i]);
          }
        }

        const amounts = filteredIncome.map(income => ({
          amount: income.amount
        }));

        // let amountsSorted = amounts.sort(function(a, b) {
        //   return new Date(a.start).getTime() - new Date(b.start).getTime();
        // });

        const incomeObject = amounts[Object.keys(amounts)[0]];
        const monthIncome = [];

        for (var amount in incomeObject) {
          monthIncome.push(incomeObject[amount]);
          break;
        }
        this.setState({ monthlyIncome: monthIncome });
      })
      .catch(err => console.error(err));
  };

  //will save the amount inputed by user to database
  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.amount) {
      API.saveIncome({
        amount: this.state.amount,
        date: moment().format(),
        email: this.state.email
      }) // need to load income
        .then(res => this.loadIncome())
        .catch(err => console.log("Front end error" + err));
    } else {
      return alert("Please fill out all monthly income");
    }
  };

  handleInputChange = event => {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
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
            <form>
              <label className="spending-label">Monthly Income:</label>
              <Input
                value={this.state.amount}
                onChange={this.handleInputChange}
                name="amount"
                placeholder="Enter amount"
              />
              <FormBtn
                disabled={!this.state.amount}
                onClick={this.handleFormSubmit}
              >
                Submit
              </FormBtn>
            </form>
            <br />
            <div className="incomeApp">
              <Card
                title={this.state.month + ` Income`}
                body1={`$` + parseInt(this.state.monthlyIncome, 10).toFixed(2)}
              />
            </div>
            <Card
              title={this.state.month + ` Budget`}
              body1={
                `Income    +$` +
                parseInt(this.state.monthlyIncome, 10).toFixed(2)
              }
              body2={`Spending  -$` + this.state.spendingTotal.toFixed(2)}
              body3={`Bills     -$` + this.state.billsTotal.toFixed(2)}
              body4={
                `Savings  $` +
                (
                  this.state.monthlyIncome -
                  (this.state.billsTotal + this.state.spendingTotal)
                ).toFixed(2)
              }
            />
          </Col>
          <Col size="4">
            <PieChartCard
              title="Spending"
              cardCategory=""
              data={this.state.spendingPieChart}
            />
          </Col>
          <Col size="4">
            <PieChartCard
              title="Bills"
              cardCategory=""
              data={this.state.billsPieChart}
            />
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
