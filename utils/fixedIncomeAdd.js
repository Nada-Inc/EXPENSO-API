const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const autoCredit = async () => {
  const date = new Date();
  const day = date.getDate(); // Returns the current day of the month (1-31)
  const month = date.getMonth(); // Returns the month index (0-11)

  const creditedData = await prisma.fixedIncome.findMany({
    where: {
      creditedDay: day,
    },
    select: {
      id: true,
      incomeName: true,
      userId: true,
      amount: true, 
    },
  });
  console.log(creditedData);
  // if(month==1 && day>28){
  //     day=28
  // }else if(day>30){
  //     if(month==3,5,7,9,11){
  //         day=30
  //     }
  // }
};

module.exports = autoCredit;
