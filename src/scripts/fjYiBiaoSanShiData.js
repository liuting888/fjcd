        //验证身份证号码
        let checkIdCard = (function() {
            // 加权因子
            var wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
            // 身份证验证位值.10代表X
            var valideCodeArr = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];
            // 区域ID
            var areaMap = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
            //错误信息
            var status = new Array("true", "身份证号码位数不对!", "身份证号码出生日期超出范围或含有非法字符!", "身份证号码校验错误!", "身份证地区非法!");
            var idCardArr;
            /* 验证身份证的地区码*/
            function checkArea(idCard) {
                if (areaMap[parseInt(idCard.substr(0, 2))] == null) {
                    return false;
                } else {
                    return true;
                }
            }
            /* 验证身份证号码中的生日是否是有效生日*/
            function checkBrith(idCard) {
                var result = true;
                if (18 == idCard.length) {
                    var year = idCard.substring(6, 10);
                    var month = idCard.substring(10, 12);
                    var day = idCard.substring(12, 14);
                    var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));

                    // 这里用getFullYear()获取年份，避免千年虫问题
                    if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
                        result = false;
                    }
                } else {
                    result = false;
                }
                return result;
            }
            /*判断身份证号码为18位时最后的验证位是否正确*/
            function check18Code(idCardArr) {
                var sum = 0; // 声明加权求和变量
                if (idCardArr[17].toLowerCase() == 'x') {
                    idCardArr[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
                }
                for (var i = 0; i < 17; i++) {
                    sum += wi[i] * idCardArr[i]; // 加权求和
                }
                var valCodePosition = sum % 11; // 得到验证码所位置
                if (idCardArr[17] == valideCodeArr[valCodePosition]) {
                    return true;
                } else {
                    return false;
                }
            }
            return function(idCard) {
                //去掉首尾空格
                idCardArr = idCard.split('');
                if (idCard.length === 15 || idCard.length === 18) {
                    if (!checkArea(idCard)) {
                        return [false, status[4]];
                    } else if (!checkBrith(idCard)) {
                        return [false, status[2]];
                    } else if (idCard.length == 18 && !check18Code(idCardArr)) {
                        return [false, status[3]];
                    } else {
                        return [true, null];
                    }
                } else {
                    //位数不对
                    return [false, status[1]];
                }
            };
        })();
        let validateIdCard = function(rule, value, callback) {
            var result = checkIdCard(value);
            if (!result[0]) {
                callback(new Error(result[1]));
            } else {
                callback();
            }
        };
        //电话号码
        let telRegExp = /^1(3|4|5|6|7|8|9)\d{9}$/;
        let validateTel = function(rule, value, callback) {
            var telBool = telRegExp.test(value);
            if (!telBool) {
                callback('请输入正确的联系电话');
            } else {
                callback();
            }
        };
        export default {
            activeList: [{
                    tableName: "T_Info_House",
                    name: "实有房屋"
                },
                {
                    tableName: "T_Info_Live_People",
                    name: "居住人员"
                },
                {
                    tableName: "T_Info_Company",
                    name: "实有单位"
                },
                {
                    tableName: "T_Info_Job_People",
                    name: "从业人员"
                },
                {
                    tableName: "T_Info_Study_People",
                    name: "实体信息"
                },
                {
                    tableName: "T_Info_Study_People",
                    name: "就学人员"
                }
            ],
            rules: {
                name: [
                    { required: true, message: "请输入名称", trigger: "blur" }
                ],
                region: [
                    { required: true, message: "请选择活动区域", trigger: "change" }
                ],
                city: [
                    { required: true, message: "请选择市、县/区", trigger: "change" }
                ],
                street: [
                    { required: true, message: "请选择街道/乡镇", trigger: "change" }
                ],
                plots: [
                    { required: true, message: "请选择社区/村", trigger: "change" }
                ],
                road: [{ required: true, message: "请输入街路巷", trigger: "blur" }],
                license: [{ required: true, message: "请输入组织机构代码/营业执照号", trigger: "blur" }],
                houseNumber: [
                    { required: true, message: "请输入门牌号", trigger: "blur" }
                ],
                community: [
                    { required: true, message: "请输入小区（组）", trigger: "blur" }
                ],
                address: [
                    { required: true, message: "请输入居住地址", trigger: "blur" }
                ],
                legalName: [
                    { required: true, message: "法人（负责人）姓名", trigger: "blur" }
                ],
                legalPhone: [{
                    required: true,
                    message: "请输入法人（负责人）联系电话",
                    trigger: "blur"
                }],
                legalIdCard: [{
                    required: true,
                    message: "请输入法人（负责人）证件号码",
                    trigger: "blur"
                }],
                entityName: [
                    { required: true, message: "请输入实体名称", trigger: "blur" }
                ],
                idCard: [
                    { required: true, message: "请输入身份证号码", trigger: "blur" },
                    { validator: validateIdCard /* ,trigger:'change' */ }
                ],
                JobTime: [
                    { type: 'date', required: true, message: "请输入入职时间", trigger: "change" }
                ],
                rpr: [{ required: true, message: "请输入户籍地址", trigger: "blur" }],
                presentAddress: [
                    { required: true, message: "请输入现住地址", trigger: "blur" }
                ],
                jobAndLive: [
                    { required: true, message: "请输入是否从业且居住", trigger: "change" }
                ],
                phone: [{ required: true, message: "请输入联系电话", trigger: "blur" },
                    { validator: validateTel /* ,trigger:'change' */ }
                ],
                police: [
                    { required: true, message: "请输入居住地派出所", trigger: "blur" }
                ],
                studyTime: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ]
            },
            list: [
                //实有房屋
                [{
                        fj: "",
                        sq: "",
                        subAudit: "市、县/区",
                        city: "",
                    },
                    {
                        fj: "",
                        sq: "",
                        subAudit: "街道/乡镇",
                        street: "",
                    },
                    {
                        fj: "",
                        sq: "",
                        subAudit: "社区/村",
                        plots: "",
                    },
                    {
                        fj: "",
                        sq: "",
                        road: "",
                        subAudit: "街路巷",
                    },
                    {
                        fj: "",
                        sq: "",
                        houseNumber: "",
                        subAudit: "门牌号",
                    },
                    {
                        fj: "",
                        sq: "",
                        community: "",
                        subAudit: "小区（组）",
                    },
                    {
                        fj: "",
                        sq: "",
                        address: "",
                        subAudit: "楼栋详址",
                    },
                    {
                        fj: "",
                        sq: "",
                        entityName: "",
                        subAudit: "实体名称",
                    }, {
                        fj: "",
                        sq: "",
                        type: "",
                        subAudit: "产权类型",
                    },
                    {
                        fj: "",
                        sq: "",
                        houseName: "",
                        subAudit: "房主姓名",
                    },
                    {
                        fj: "",
                        sq: "",
                        legalName: "",
                        subAudit: "产权单位、法人姓名",
                    },
                    {
                        fj: "",
                        sq: "",
                        idCard: "",
                        subAudit: "证件号码",
                    }, {
                        fj: "",
                        sq: "",
                        phone: "",
                        subAudit: "联系电话",
                    },
                    {
                        fj: "",
                        sq: "",
                        rent: "",
                        subAudit: "是否出租房屋",
                    },
                    {
                        fj: "",
                        sq: "",
                        time: "",
                        subAudit: "房屋建成时间/出租时间",
                    },
                    {
                        fj: "",
                        sq: "",
                        suboffice: "",
                        subAudit: "房屋所属分局",
                    },
                    {
                        fj: "",
                        sq: "",
                        police: "",
                        subAudit: "房屋所属派出所",
                    },
                    {
                        fj: "",
                        sq: "",
                        remark: "",
                        subAudit: "备注",
                    }
                ],
                //居住人员
                [{
                        fj: "",
                        sq: "",
                        name: "",
                        subAudit: "姓名",
                    },
                    {
                        fj: "",
                        sq: "",
                        idCard: "",
                        subAudit: "身份证号码",
                    },
                    {
                        fj: "",
                        sq: "",
                        phone: "",
                        subAudit: "联系电话",
                    },
                    {
                        fj: "",
                        sq: "",
                        actualLive: "",
                        subAudit: "实际居住/户籍标注",
                    },
                    {
                        fj: "",
                        sq: "",
                        liveState: "",
                        subAudit: "居住状态说明",
                    },
                    {
                        fj: "",
                        sq: "",
                        liveTime: "",
                        subAudit: "入住时间",
                    },
                    {
                        fj: "",
                        sq: "",
                        phoneRemark: "",
                        subAudit: "电话备注",
                    },
                    {
                        fj: "",
                        sq: "",
                        peopleRelation: "",
                        subAudit: "人员关系",
                    }
                ],
                //实有单位
                [{
                        fj: "",
                        sq: "",
                        subAudit: "市、县/区",
                        city: "",
                    },
                    {
                        fj: "",
                        sq: "",
                        subAudit: "街道/乡镇",
                        street: "",
                    },
                    {
                        fj: "",
                        sq: "",
                        plots: "",
                        subAudit: "社区/村",
                    },
                    {
                        fj: "",
                        sq: "",
                        road: "",
                        subAudit: "街路巷",
                    },
                    {
                        fj: "",
                        sq: "",
                        houseNumber: "",
                        subAudit: "门牌号",
                    },
                    {
                        fj: "",
                        sq: "",
                        community: "",
                        subAudit: "小区（组）",
                    },
                    {
                        fj: "",
                        sq: "",
                        address: "",
                        subAudit: "楼栋详址",
                    },
                    {
                        fj: "",
                        sq: "",
                        companyType: "",
                        subAudit: "单位类别",
                    }, {
                        fj: "",
                        sq: "",
                        legalName: "",
                        subAudit: "法人（负责人）姓名",
                    },
                    {
                        fj: "",
                        sq: "",
                        companyPhone: "",
                        subAudit: "单位电话",
                    },
                    {
                        fj: "",
                        sq: "",
                        legalPhone: "",
                        subAudit: "法人（负责人）联系电话",
                    },
                    {
                        fj: "",
                        sq: "",
                        //缺少
                        subAudit: "组织机构代码/营业执照号",
                    }, {
                        fj: "",
                        sq: "",
                        legalIdCard: "",
                        subAudit: "法人（负责人）证件号码",
                    },
                    {
                        fj: "",
                        sq: "",
                        police: "",
                        subAudit: "单位登记所属分局、派出所",
                    },
                    {
                        fj: "",
                        sq: "",
                        remark: "",
                        subAudit: "备注",
                    }
                ],
                //从业人员
                [{
                        fj: "",
                        sq: "",
                        name: "",
                        subAudit: "姓名",
                    },
                    {
                        fj: "",
                        sq: "",
                        idCard: "",
                        subAudit: "身份证号码",
                    },
                    {
                        fj: "",
                        sq: "",
                        phone: "",
                        subAudit: "联系电话",
                    },
                    {
                        fj: "",
                        sq: "",
                        jobTime: "",
                        subAudit: "入职时间",
                    },
                    {
                        fj: "",
                        sq: "",
                        rpr: "",
                        subAudit: "户籍地址",
                    },
                    {
                        fj: "",
                        sq: "",
                        presentAddress: "",
                        subAudit: "现住地址",
                    },
                    {
                        fj: "",
                        sq: "",
                        jobAndLive: "",
                        subAudit: "是否从业且居住",
                    }
                ],
                //实体信息
                [{
                        fj: "",
                        sq: "",
                        entityName: "",
                        subAudit: "实体名称",
                    },
                    {
                        fj: "",
                        sq: "",
                        entityType: "",
                        subAudit: "实体分类",
                    },
                    {
                        fj: "",
                        sq: "",
                        city: "",
                        subAudit: "市",
                    },
                    {
                        fj: "",
                        sq: "",
                        county: "",
                        subAudit: "县/区",
                    },
                    {
                        fj: "",
                        sq: "",
                        subAudit: "街道/乡镇",
                        street: "",
                    },
                    {
                        fj: "",
                        sq: "",
                        plots: "",
                        subAudit: "社区/村",
                    },
                    {
                        fj: "",
                        sq: "",
                        road: "",
                        subAudit: "街路巷",
                    },
                    {
                        fj: "",
                        sq: "",
                        houseNumber: "",
                        subAudit: "门牌号",
                    }, {
                        fj: "",
                        sq: "",
                        community: "",
                        subAudit: "小区",
                    },
                    {
                        fj: "",
                        sq: "",
                        address: "",
                        subAudit: "楼栋详址",
                    },
                    {
                        fj: "",
                        sq: "",
                        upperNumber: "",
                        subAudit: "地上层数",
                    },
                    {
                        fj: "",
                        sq: "",
                        underNumber: "",
                        subAudit: "地下层数",
                    }, {
                        fj: "",
                        sq: "",
                        mergeAddress: "",
                        subAudit: "合并地址",
                    },
                    {
                        fj: "",
                        sq: "",
                        lngAndlat: "",
                        subAudit: "经纬度",
                    }
                ],
                //就学信息
                [{
                        fj: "",
                        sq: "",
                        name: "",
                        subAudit: "姓名",
                    },
                    {
                        fj: "",
                        sq: "",
                        idCard: "",
                        subAudit: "身份证号码",
                    },
                    {
                        fj: "",
                        sq: "",
                        phone: "",
                        subAudit: "电话号码",
                    },
                    {
                        fj: "",
                        sq: "",
                        studyTime: "",
                        subAudit: "入学时间",
                    },
                    {
                        fj: "",
                        sq: "",
                        time: "",
                        subAudit: "就读时限",
                    },
                    {
                        fj: "",
                        sq: "",
                        grade: "",
                        subAudit: "年级",
                    },
                    {
                        fj: "",
                        sq: "",
                        bclass: "",
                        subAudit: "班级",
                    },
                    {
                        fj: "",
                        sq: "",
                        student: "",
                        subAudit: "学号",
                    }, {
                        fj: "",
                        sq: "",
                        police: "",
                        subAudit: "居住地派出所",
                    },
                    {
                        fj: "",
                        sq: "",
                        address: "",
                        subAudit: "居住地址",
                    },
                    {
                        fj: "",
                        sq: "",
                        remark: "",
                        subAudit: "备注",
                    },
                    {
                        fj: "",
                        sq: "",
                        isLive: "",
                        subAudit: "是否就学且居住",
                    }
                ]
            ]
        }