import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
//creating a instance of prisma to interact with the database
const prisma = new PrismaClient();

export const getDashboardMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // we use prsima to grab the data from the database, CRUD operations
    const popularProducts = await prisma.products.findMany({
      take: 15,
      orderBy: {
        stockQuantity: "desc",
        // stockQuantity is a item of the table and its in descending order
      },
    });
    const salesSummary = await prisma.salesSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });
    const purchaseSummary = await prisma.purchaseSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });
    const expenseSummary = await prisma.expenseSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });
    const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany(
      {//this doesnt need to be sent bcuz its just used so after we can convert its items
        take: 5,
        orderBy: {
          date: "desc",
        },
      }
    );
    //grabbing that item and mapping it out to a new object but with amount turned to a string
    const expenseByCategorySummary = expenseByCategorySummaryRaw.map(
      (item) => ({
        ...item,
        amount: item.amount.toString(),
      })//we transform the data in the backend bcuz thats how we need it in the frontend
    );

    //sending each of these as json
    res.json({
      popularProducts,
      salesSummary,
      purchaseSummary,
      expenseSummary,
      expenseByCategorySummary,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving dashboard metrics" });
  }
};