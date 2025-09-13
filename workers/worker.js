const { parentPort, workerData } = require("worker_threads");
const xlsx = require("xlsx");
const fs = require("fs");
const mongoose = require("mongoose");
const Agent = require("../models/Agent");
const User = require("../models/User");
const UserAccount = require("../models/UserAccount");
const PolicyCategory = require("../models/PolicyCategory");
const PolicyCarrier = require("../models/PolicyCarrier");
const PolicyInfo = require("../models/PolicyInfo");

// MongoDB connection
mongoose.connect(`${process.env.MONGO_URL}/policyDB`);

async function processFile(fileName) {
    try {
        const filePath = "./uploads/" + fileName;
        let jsonData = [];
        console.log("filePath", filePath);
        if (filePath.endsWith(".csv")) {
            const data = fs.readFileSync(filePath, "utf8");
            // console.log('data', data);
            const lines = data.split("\n");
            const headers = lines[0].split(",");
            jsonData = lines.slice(1).map((line) => {
                const values = line.split(",");

                return headers.reduce((obj, header, idx) => {
                    obj[header.trim()] = values[idx]?.trim();
                    return obj;
                }, {});
            });
        } else if (filePath.endsWith(".xlsx")) {
            const workbook = xlsx.readFile(filePath);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            jsonData = xlsx.utils.sheet_to_json(sheet);
        } else {
            throw new Error("Unsupported file format");
        }

        for (const record of jsonData) {

            if (
                record.firstname &&
                record.email &&
                record?.company_name &&
                record?.category_name &&
                record?.account_name
            ) {
                let checkUserExist = await User.findOne({ email: record.email });
                if (!checkUserExist) {
                    const details = {
                        firstname: record.firstname,
                        dob: record.dob,
                        address: record.address,
                        phone: record.phone,
                        state: record.state,
                        zip: record.zip,
                        email: record.email,
                        gender: record.gender,
                        userType: record.userType,
                    };
                    checkUserExist = await User.create(details);
                }

                let checkUserAccountExist = await UserAccount.findOne({
                    user_id: checkUserExist._id,
                    account_name: record.account_name,
                });

                if (!checkUserAccountExist) {
                    checkUserAccountExist = await UserAccount.create({
                        account_name: record.account_name,
                        user_id: checkUserExist._id,
                    });
                };

                let agentExist = await Agent.findOne({ name: record.agent });
                if (!agentExist) {
                    agentExist = await Agent.create({
                        name: record?.agent,
                    });
                }
                let categoryExist = await PolicyCategory.findOne({
                    category_name: record.category_name,
                });
                if (!categoryExist) {
                    categoryExist = await PolicyCategory.create({
                        category_name: record.category_name,
                    });
                }

                let carrierExist = await PolicyCarrier.findOne({
                    company_name: record.company_name,
                });
                if (!carrierExist) {
                    carrierExist = await PolicyCarrier.create({
                        company_name: record.company_name,
                    });
                }

                let policy_info_exist = await PolicyInfo.findOne({
                    policy_number: record.policy_number,
                });

                if (!policy_info_exist) {
                    policy_info_exist = await PolicyInfo.create({
                        policy_number: record.policy_number,
                        policy_category_id: categoryExist._id,
                        policy_carrier_id: carrierExist._id,
                        user_id: checkUserExist._id,
                        policy_start_date: record.policy_start_date,
                        policy_end_date: record.policy_end_date,
                        premium_amount: record.premium_amount,
                    });
                }
            }
        };

        fs.unlinkSync(filePath);
        parentPort.postMessage({ msg: "Upload Completed" });
    } catch (err) {
        console.log("err", err);
        parentPort.postMessage({ error: err.message });
    }
}

processFile(workerData.filePath)
    .then((msg) => console.log("msg", msg))
    .catch((err) => parentPort.postMessage({ error: err.message }));
