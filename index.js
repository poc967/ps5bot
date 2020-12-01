const { Builder, By, until, Key } = require("selenium-webdriver");
const { elementLocated } = require("selenium-webdriver/lib/until");
require("dotenv").config();

async function buyPlaystation5() {
  console.time();
  const driver = await new Builder()
    .forBrowser("chrome")
    .withCapabilities({
      browserName: "chrome",
      chromeOptions: {
        args: [
          'user-agent="Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36"',
        ],
      },
    })
    .build();
  driver.manage().setTimeouts({ implicit: 100000 });
  driver.manage().window().maximize();

  try {
    await open_site(driver);
    await add_to_cart(driver);
    await checkout(driver);
    await guest_checkout(driver);
    await input_delivery_details(driver);
    await payment_details(driver);
    await driver.quit();
    console.timeEnd();
  } catch (error) {
    console.log(error);
    await driver.quit();
    console.timeEnd();
  }
}

async function open_site(driver) {
  await driver.get(process.env.base_url);
}

async function add_to_cart(driver) {
  const button = driver.wait(
    until.elementLocated(By.className("prod-ProductCTA--primary")),
    30000
  );
  await button.click();
  // await driver.sleep(3000);
  console.log("Item added to cart");
}

async function checkout(driver) {
  const cart = driver.wait(
    until.elementLocated(By.className("checkoutBtn")),
    3000
  );
  // await driver.sleep(3000);

  await cart.click();
  // await driver.sleep(3000);
  console.log("clicked checkout");
}

async function guest_checkout(driver) {
  await driver
    .wait(until.elementLocated(By.className("button--primary")), 30000)
    .click();
  // await driver.sleep(3000);

  await driver
    .wait(until.elementLocated(By.className("cxo-continue-btn")), 30000)
    .click();
  // await driver.sleep(3000);
}

async function input_delivery_details(driver) {
  await driver.findElement(By.id("firstName")).sendKeys(process.env.firstName);
  await driver.findElement(By.id("lastName")).sendKeys(process.env.lastName);
  await driver.findElement(By.id("phone")).sendKeys(process.env.phone);
  await driver.findElement(By.id("email")).sendKeys(process.env.email);
  await driver
    .findElement(By.id("addressLineOne"))
    .sendKeys(process.env.addressLineOne);
  await driver
    .findElement(By.id("addressLineTwo"))
    .sendKeys(process.env.addressLineTwo);
  await driver.findElement(By.id("city")).clear();
  await driver.findElement(By.id("city")).sendKeys(process.env.city);
  await driver.findElement(By.className("input-toggle__input")).click();
  await driver.findElement(By.id("postalCode")).clear();
  // await driver.sleep(3000);
  await driver
    .findElement(By.id("postalCode"))
    .sendKeys(process.env.postalCode, Key.ENTER);
  // await driver.sleep(3000);
  // await driver.sleep(3000);
}

async function payment_details(driver) {
  // await driver.sleep(3000);
  await driver.findElement(By.id("cvv")).sendKeys(process.env.ccCVV);
  await driver.findElement(By.id("creditCard")).sendKeys(process.env.ccNumber);
  // await driver.sleep(3000);
  await driver
    .findElement(
      By.css(
        `#month-chooser > option:nth-child(${
          Number(process.env.ccExpMonth) + 1
        })`
      )
    )
    .click();
  // await driver.sleep(3000);
  await driver
    .findElement(
      By.css(
        `#year-chooser > option:nth-child(${
          Number(process.env.ccExpYear) - 18
        })`
      )
    )
    .click();
  await driver.findElement(By.id("phone")).sendKeys(Key.ENTER);
  await driver.sleep(10000);
}

// add cheerio script to webscrape and trigger this function when the playstation becomes available
buyPlaystation5();
