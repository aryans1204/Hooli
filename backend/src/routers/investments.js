/**
 * mongoose module
 * @const
 */
 const mongoose = require("mongoose");

 /**
  * express module
  * @const
  */
 const express = require("express");
 
 /**
  * Investment module
  * @const
  */
 const Investment = require("../models/investments");
 
 /**
  * auth module
  * @const
  */
 const auth = require("../authentication/auth");
 
 /**
  * date-and-time module
  * @const
  */
 const date = require("date-and-time");
 
 /**
  * request module
  * @const
  */
 const needle = require("needle");
 const request = require("request");
 
 /**
  * Express router to mount user related functions on.
  * @type {object}
  * @const
  */
 const router = new express.Router();
 
 const fetchData = async (params, type) => {
   const data = [];
   if (type === "equities") {
     ind = 0;
     for (param of params) {
       var url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${params[ind].equity_ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
       const temp = await needle("get", url);
       data[ind] = temp.body;
       ind = ind + 1;
     }
   } else {
     ind = 0;
     for (param of params) {
       var url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${params[ind].derivative_ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
       const temp = await needle("get", url);
       data[ind] = temp.body;
       ind = ind + 1;
     }
   }
 
   return data;
 };
 /**
  * Route to create a new portfolio.
  * @name post/api/investments
  * @async
  * @param {String} path
  * @param {Object} auth
  * @param {callback} middleware
  * @throws {BadRequestError}
  */
 router.post("/api/investments", auth, async (req, res) => {
   const portfolio = new Investment({
     ...req.body,
     portfolio_owner: req.user._id,
   });
   try {
     await portfolio.save();
     res.status(201).send(portfolio);
   } catch (e) {
     res.status(400).send(e);
   }
 });
 
 /**
  * Route to get a portfolio by ID.
  * @name get/api/investments/:id
  * @async
  * @param {String} path
  * @param {Object} auth
  * @param {callback} middleware
  * @throws {NotFoundError} Portfolio cannot be found.
  * @throws {InternalServerError}
  */
 router.get("/api/investments", auth, async (req, res) => {
   const _id = req.params.id;
 
   try {
     const portfolios = await Investment.find({
       portfolio_owner: req.user._id,
     });
 
     if (!portfolios || portfolios.length === 0) {
       return res.status(404).send();
     }
     let now = new Date();
     now.setDate(now.getDate() - 1);
     let getYear = now.toLocaleDateString("default", { year: "numeric" });
     let getMonth = now.toLocaleDateString("default", { month: "2-digit" });
     let getDay = now.toLocaleDateString("default", { day: "2-digit" });
     now = getYear + "-" + getMonth + "-" + getDay;
 
     for (const portfolio of portfolios) {
       console.log("current portfolio: ");
       console.log(portfolio);
       const data = await fetchData(portfolio.equities, "equities");
       //console.log(data);
       portfolio.equities.forEach((equity, index) => {
         //console.log(data[index]["Time Series (Daily)"]["2022-12-07"]);
         /*const current_price = parseInt(
         data[index]["Time Series (Daily)"][now]["1. open"]
       );*/
         /*let current_price = 0;
         let i = 0;
         var tempDate = getDay
         var tempMonth = getMonth
         while (!current_price && i < 7) {
           console.log("current price = " + current_price);
           if (getDay-i == 0) {
             tempDate = 30
             tempMonth--
           }
           // check up to 7 days back
           let date = getYear + "-" + tempMonth + "-" + (tempDate).toString();
           console.log(date)
           if (data[index]["Time Series (Daily)"][date] !== undefined) {
             console.log("i'm running");
             current_price = parseInt(
               data[index]["Time Series (Daily)"][date]["1. open"]
             );
             break;
           }
           i++;
           tempDate--
         }*/
         let current_price = data[index]["Global Quote"]["02. open"]
         console.log(`current price ${current_price}`);
         const pnl =
           (
             ((current_price - equity.equity_buy_price) /
               equity.equity_buy_price) *
             100
           ).toString() + "%";
         portfolio.equities[index].equity_current_price = current_price;
         portfolio.equities[index].equity_pnl = pnl;
       });
       console.log("equities here");
       console.log(portfolio.equities);
       const optionsData = await fetchData(portfolio.options, "options");
       portfolio.options.forEach((option, index) => {
         /*const current_price = parseInt(
         optionsData[index]["Time Series (Daily)"][now]["1. open"]
       );
       portfolio.options[index].derivative_current_price = current_price;*/
         /*let current_price = 0;
         let i = 0;
         var tempDate = getDay
         var tempMonth = getMonth
         while (!current_price && i < 7) {
           // check up to 7 days back
           if (getDay-i == 0) {
             tempDate = 30
             tempMonth--
           }
           // check up to 7 days back
           let date = getYear + "-" + tempMonth + "-" + (tempDate).toString();
           if (optionsData[index]["Time Series (Daily)"][date] !== undefined) {
             current_price = parseInt(
               optionsData[index]["Time Series (Daily)"][date]["1. open"]
             );*/
             let current_price = optionsData[index]["Global Quote"]["02. open"]
             portfolio.options[index].derivative_current_price = current_price;
       });
       console.log("options here");
       console.log(portfolio.options);
       await portfolio.save();
     }
     res.send(portfolios);
     console.log("saved and sent");
   } catch (e) {
     console.log(e);
     res.status(500).send();
   }
 });
 
 /**
  * Route to update an existing equity in a portfolio by ID.
  * @name patch/api/investments/equities:id
  * @async
  * @param {String} path
  * @param {Object} auth
  * @param {callback} middleware
  * @throws {NotFoundError} Portfolio cannot be found.
  * @throws {BadRequestError}
  */
 router.patch("/api/investments/equities/:id", auth, async (req, res) => {
   const updates = Object.keys(req.body);
 
   try {
     let portfolio = await Investment.findOne({
       _id: req.params.id,
       portfolio_owner: req.user._id,
     });
 
     if (!portfolio) {
       return res.status(404).send();
     }
     let now = new Date();
     now.setDate(now.getDate() - 1);
     let getYear = now.toLocaleDateString("default", { year: "numeric" });
     let getMonth = now.toLocaleDateString("default", { month: "2-digit" });
     let getDay = now.toLocaleDateString("default", { day: "2-digit" });
     now = getYear + "-" + getMonth + "-" + getDay;
     var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${req.body.equity_ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
     let data = await needle("get", url);
     data = data.body;
     console.log(data);
     let current_price = 0;
     let i = 0;
     while (!current_price && i < 7) {
       console.log("current price = " + current_price);
       // check up to 7 days back
       let date = now.slice(0, 8) + (getDay - i).toString();
       if (data["Time Series (Daily)"][date] !== undefined) {
         current_price = parseInt(data["Time Series (Daily)"][date]["1. open"]);
         break;
       }
       i++;
     }
     console.log("Current price");
     console.log(current_price);
     const pnl =
       (
         ((current_price - req.body.equity_buy_price) /
           req.body.equity_buy_price) *
         100
       ).toString() + "%";
     const temp = portfolio.equities.concat({
       equity_ticker: req.body.equity_ticker,
       equity_pnl: pnl,
       equity_buy_price: req.body.equity_buy_price,
       equity_current_price: current_price,
     });
     portfolio.equities = temp;
     await portfolio.save();
     res.send(portfolio);
   } catch (e) {
     res.status(400).send(e);
     console.log(e);
   }
 });
 
 /**
  * Route to update an existing option in a portfolio by ID.
  * @name patch/api/investments/options/:id
  * @async
  * @param {String} path
  * @param {Object} auth
  * @param {callback} middleware
  * @throws {NotFoundError} Portfolio cannot be found.
  * @throws {BadRequestError}
  */
 router.patch("/api/investments/options/:id", auth, async (req, res) => {
   try {
     let portfolio = await Investment.findOne({
       _id: req.params.id,
       portfolio_owner: req.user._id,
     });
     if (!portfolio) {
       res.status(404).send();
     }
 
     let now = new Date();
     now.setDate(now.getDate() - 1);
     let getYear = now.toLocaleDateString("default", { year: "numeric" });
     let getMonth = now.toLocaleDateString("default", { month: "2-digit" });
     let getDay = now.toLocaleDateString("default", { day: "2-digit" });
     now = getYear + "-" + getMonth + "-" + getDay;
     var url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${req.body.derivative_ticker}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
     let data = await needle("get", url);
     data = data.body;
     let current_price = 0;
     let i = 0;
     while (!current_price && i < 7) {
       // check up to 7 days back
       const date = now.slice(0, 8) + (getDay - i).toString();
       if (data["Time Series (Daily)"][date] !== undefined) {
         current_price = parseInt(data["Time Series (Daily)"][date]["1. open"]);
         break;
       }
       i++;
     }
     const temp = portfolio.options.concat({
       derivative_ticker: req.body.derivative_ticker,
       option_type: req.body.option_type,
       strike_price: req.body.strike_price,
       expiration_date: req.body.expiration_date,
       derivative_current_price: current_price,
     });
     portfolio.options = temp;
     await portfolio.save();
     res.send(portfolio);
   } catch (e) {
     res.status(400).send(e);
     console.log(e);
   }
 });
 
 /**
  * Route to delete an entire portfolio.
  * @name delete/api/investments/:id
  * @async
  * @param {String} path
  * @param {Object} auth
  * @param {callback} middleware
  * @throws {NotFoundError} Portfolio cannot be found.
  * @throws {InternalServerError}
  */
 router.delete("/api/investments/:id", auth, async (req, res) => {
   try {
     const portfolio = await Investment.findOneAndDelete({
       _id: req.params.id,
       portfolio_owner: req.user._id,
     });
 
     if (!portfolio) {
       res.status(404).send();
     }
 
     res.send(portfolio);
   } catch (e) {
     res.status(500).send();
   }
 });
 
 /**
  * Route to delete an equity in a portfolio.
  * @name delete/api/investments/equities/:id
  * @async
  * @param {String} path
  * @param {Object} auth
  * @param {callback} middleware
  * @throws {InternalServerError}
  */
 router.delete("/api/investments/equities/:id", auth, async (req, res) => {
   try {
     const portfolio = await Investment.findOne({
       _id: req.params.id,
       portfolio_owner: req.user._id,
     });
     const eq = portfolio.equities;
     const del_val = req.body.equity_ticker;
     eq.forEach((equity, index) => {
       if (equity.equity_ticker === del_val) {
         delete eq.splice(index, 1);
       }
     });
     portfolio.equities = eq;
     await portfolio.save();
     res.send(portfolio);
   } catch (e) {
     res.status(500).send();
     console.log(e);
   }
 });
 
 /**
  * Route to delete an option in a portfolio.
  * @name delete/api/investments/options/:id
  * @async
  * @param {String} path
  * @param {Object} auth
  * @param {callback} middleware
  * @throws {InternalServerError}
  */
 router.delete("/api/investments/options/:id", auth, async (req, res) => {
   try {
     const portfolio = await Investment.findOne({
       _id: req.params.id,
       portfolio_owner: req.user._id,
     });
     const opt = portfolio.options;
     const del_val = req.body.derivative_ticker;
     opt.forEach((option, index) => {
       if (option.derivative_ticker === del_val) {
         opt.splice(index, 1);
       }
     });
     portfolio.options = opt;
     await portfolio.save();
     res.send(portfolio);
   } catch (e) {
     res.status(500).send();
   }
 });
 
 module.exports = router;
 