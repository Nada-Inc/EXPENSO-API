const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const autoCredit = async () => {
  const date = new Date();
  // const day = date.getDate(); // Returns the current day of the month (1-31)
  // const month = date.getMonth(); // Returns the month index (0-11)
  day=30
  month=3
  let days = [day];

  try {
    if (month == 1 && day >= 28) {
      if(day==29){
        days =[]
      }else{
        days = [28, 29, 30, 31];
      }
    } else if (day ==  30) {
      if (month == 3 || month == 5 || month == 8 || month == 10) {
        days = [30, 31];
      }
    }
    const creditedData = await prisma.fixedIncome.findMany({
      where: {
        creditDate: {
          in: days,
        },
      },
      select: {
        id: true,
        incomeName: true,
        userId: true,
        amount: true,
      },
    });
    console.log(days,creditedData)
    for (const element of creditedData) {
      await prisma.fixedIncomeData.create({
        data: {
          fixIncomeId: element.id,
          amount: element.amount,
        },
      });
    }
  } catch (error) {
    console.log("error:",error);
  }
};

module.exports = autoCredit;
