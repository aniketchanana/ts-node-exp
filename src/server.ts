import express from "express";
import cookieParser from "cookie-parser";
import "reflect-metadata";
import "./data/mongo/init";
const server = express();
server.use(cookieParser());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

export default server;
