function checksSol(a, n) {
    if (n == 1) {
        if (a[0] == 24) {
            return 1;
        }
        return 0;
    }
    var i, j, k;
    for (i = 0; i < n; i++) {
        for (j = i + 1; j < n; j++) {
            //从数组中选取两个数，以不同的方式合并成一个数，再去判断更小规模的情况
            var t1 = a[i], t2 = a[j], r = 0;
            var b = new Array(4);   //b[]数组用于保存合并两数后的新数组
            for (k = 0; k < n; k++) {
                if ((k != i) && (k != j)) b[r++] = a[k];
            }
            //通过不同的运算符连接所选的两个数
            b[n - 2] = t1 + t2;
            if (checksSol(b, n - 1)) return 1;
            b[n - 2] = t1 * t2;
            if (checksSol(b, n - 1)) return 1;
            b[n - 2] = t1 - t2;
            if (checksSol(b, n - 1)) return 1;
            b[n - 2] = t2 - t1;
            if (checksSol(b, n - 1)) return 1;
            b[n - 2] = t1 / t2;
            if (checksSol(b, n - 1)) return 1;
            b[n - 2] = t2 / t1;
            if (checksSol(b, n - 1)) return 1;
        }
    }
    return 0;
}   //确保有解

var a = new Array(1, 1, 1, 1);
while (!checksSol(a, 4)) {
    for (i = 0; i < 4; i++) {
        a[i] = Math.floor(Math.random() * 10 + 1);
    }
}   //随机生成四个有解的数

//将生成的四个随机数填入输入部分的四个按钮，同时生成对应的扑克牌图片
var ini1 = document.getElementById("ini1");
ini1.innerText = a[0];
document.write("<img src=poker/" + "spade" + a[0] + ".jpg style='width:10%;height:15%;float:left;margin-left:180px;' align='center'>");

var ini2 = document.getElementById("ini2");
ini2.innerText = a[1];
document.write("<img src=poker/" + "heart" + a[1] + ".jpg style='width:10%;height:15%;float:left;margin-left:180px;' align='center'>");

var ini3 = document.getElementById("ini3");
ini3.innerText = a[2];
document.write("<img src=poker/" + "club" + a[2] + ".jpg style='width:10%;height:15%;float:left;margin-left:180px;' align='center'>");

var ini4 = document.getElementById("ini4");
ini4.innerText = a[3];
document.write("<img src=poker/" + "diamond" + a[3] + ".jpg style='width:10%;height:15%;float:left;margin-left:180px;' align='center'>");

//生成提示的函数
function hint() {
    document.getElementById("answer").innerHTML = "";
    var operator = new Array('+', '-', '*', '/');
    var results = new Array();
    var number = new Array(4);
    number[0] = a[0];
    number[1] = a[1];
    number[2] = a[2];
    number[3] = a[3];
    getNumber(number);
    var ansnum = results.length;
    if (ansnum > 13) {
        ansnum = 13;
    }   //控制生成答案的个数
    for (var i1 = 0; i1 < ansnum; i1++) {
        document.getElementById("answer").innerHTML += results[i1] + "<br>";
    }

    function getNumber(number) {
        //四重循环遍历所有顺序
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (i == j) {
                    continue;
                }
                for (var k = 0; k < 4; k++) {
                    if (k == j || k == i) {
                        continue;
                    }
                    for (var m = 0; m < 4; m++) {
                        if (m == k || m == j || m == i) {
                            continue;
                        }
                        calculation(number[i], number[j], number[k], number[m]);
                    }
                }
            }
        }
    }

    function calculation(num1, num2, num3, num4) {
        //三重循环选择不同的运算符
        for (var i = 0; i < 4; i++) {
            /*	第一次计算，保存此时的操作符和计算结果
                此时有3种情况，相当于从4个数中选择2个相邻的数来计算
                如（1-2）-3-4， 1-（2-3）-4， 1-2-（3-4）*/
            var operator1 = operator[i];
            var firstResult = calcute(num1, num2, operator1);
            var midResult = calcute(num2, num3, operator1);
            var tailResult = calcute(num3, num4, operator1);   //三种不同的加括号方式
            for (var j = 0; j < 4; j++) {
				/*	第二次计算，保存此时的操作符和计算结果
				此时有5种情况，相当于从3个数中选择2个相邻的数来计算
				如（（1-2）-3）-4，（1-2）-（3-4）， （1-（2-3））-4， 1-（（2-3）-4），1-（2-（3-4））*/
                var operator2 = operator[j];
                var firstMidResult = calcute(firstResult, num3, operator2);
                var firstTailResult = calcute(num3, num4, operator2);
                var midFirstResult = calcute(num1, midResult, operator2);
                var midTailResult = calcute(midResult, num4, operator2);
                var tailMidResult = calcute(num2, tailResult, operator2);   //计算五种不同情况对应的中间结果
                for (var k = 0; k < 4; k++) {
                    //最后一次计算，得出最终结果，如果是24则保存表达式
                    var operator3 = operator[k];
                    if (calcute(firstMidResult, num4, operator3) == 24) {
                        var expression1 = "((" + num1 + operator1 + num2 + ")" + operator2 + num3 + ")" + operator3 + num4;
                        if (!expression1.in_array(results)) { results.push(expression1); }
                    }
                    if (calcute(firstResult, firstTailResult, operator3) == 24) {
                        var expression2 = "(" + num1 + operator1 + num2 + ")" + operator3 + "(" + num3 + operator2 + num4 + ")";
                        if (!expression2.in_array(results)) { results.push(expression2); }
                    }
                    if (calcute(midFirstResult, num4, operator3) == 24) {
                        var expression3 = "(" + num1 + operator2 + "(" + num2 + operator1 + num3 + "))" + operator3 + num4;
                        if (!expression3.in_array(results)) { results.push(expression3); }
                    }
                    if (calcute(num1, midTailResult, operator3) == 24) {
                        var expression4 = "" + num1 + operator3 + "((" + num2 + operator1 + num3 + ")" + operator2 + num4 + ")";
                        if (!expression4.in_array(results)) { results.push(expression4); }
                    }
                    if (calcute(num1, tailMidResult, operator3) == 24) {
                        var expression5 = "" + num1 + operator3 + "(" + num2 + operator2 + "(" + num3 + operator1 + num4 + "))";
                        if (!expression5.in_array(results)) { results.push(expression5); }
                    }
                }
            }
        }
    }
    function calcute(number1, number2, operator) {
        if (operator == '+') {
            return number1 + number2;
        } else if (operator == '-') {
            return number1 - number2;
        } else if (operator == '*') {
            return number1 * number2;
        } else if (operator == '/' && number2 != 0) {
            return number1 / number2;
        } else {
            return -1;
        }
    }

}

function rules() {
    document.getElementById("answer").innerHTML = "<br>" +
        "游戏规则：由系统随机生成4张扑克牌，用户" + "<br>" +
        "利用扑克牌的数字及运算符号 +、-、*、/ 及" + "<br>" +
        "括号 ) 和 ( 鼠标点击输入一个计算表达式，系" + "<br>" +
        "统运行后得出计算结果，如果结果等于24，" + "<br>" +
        "则显示Congratulation!，否则显示Incorrect!" + "<br>" + "<br>" +
        "左边的Hint按钮可以显示提示。" + "<br>" +
        "右边的C按钮可以跳过本题。" + "<br>" + "<br>" +
        "注意：对每题您只有一次输入机会！";
}

var isClicked = new Array(4);   //isClicked数组控制每个数字只能使用一次
for (var i = 0; i < 4; i++) {
    isClicked[i] = false;
}
function appContent(button) {
    var content = document.getElementById("formula");  //显示运算过程的区域
    var text = button.innerText;

    if ("C" == text) {
        content.innerText = "";
        location.reload();
        //如果按了C则清空运算过程的区域并刷新页面
    } else if ("=" == text) {
        var resultText = parse(content.innerText);
        content.innerText = "";
        if (resultText == 24) {
            alert("Congratulation!");
        } else if (resultText != 24) {
            alert("Incorrect!");
        }
        location.reload();
        //除了上面两种情况,其他的都是尾加
    } else {
        content.innerText = content.innerText + text;
    }
}

function appContentonce0(button) {

    if (!isClicked[0]) {
        var content = document.getElementById("formula");
        var text = button.innerText;
        content.innerText = content.innerText + text;
    }
    isClicked[0] = true;
    button.disabled = true;
}
function appContentonce1(button) {

    if (!isClicked[1]) {
        var content = document.getElementById("formula");
        var text = button.innerText;
        content.innerText = content.innerText + text;
    }
    isClicked[1] = true;
    button.disabled = true;
}
function appContentonce2(button) {

    if (!isClicked[2]) {
        var content = document.getElementById("formula");
        var text = button.innerText;
        content.innerText = content.innerText + text;
    }
    isClicked[2] = true;
    button.disabled = true;
}
function appContentonce3(button) {

    if (!isClicked[3]) {
        var content = document.getElementById("formula");
        var text = button.innerText;
        content.innerText = content.innerText + text;
    }
    isClicked[3] = true;
    button.disabled = true;
}

//计算结果的函数
/*function parse(content) {

    //寻找最后一个左括号
    var index = content.lastIndexOf("(");

    //如果等式中有左括号
    if (index > -1) {
        //寻找右括号,从左括号的位置开始寻找
        var endIndex = content.indexOf(")", index);

        //如果等式中有右括号
        if (endIndex > -1) {
            //调用自己算出括号中的结果
            var result = parse(content.substring(index + 1, endIndex));
            //然后继续调用自己
            return parse(content.substring(0, index) + ("" + result) + content.substring(endIndex + 1))
        }
    }   //算式中的括号处理完毕

    index = content.indexOf("+");
    if (index > -1) {
        return parse(content.substring(0, index)) + parse(content.substring(index + 1));
    }

    index = content.lastIndexOf("-");
    if (index > -1) {
        return parse(content.substring(0, index)) - parse(content.substring(index + 1));
    }

    index = content.lastIndexOf("*");
    if (index > -1) {
        return parse(content.substring(0, index)) * parse(content.substring(index + 1));
    }

    index = content.lastIndexOf("/");
    if (index > -1) {
        return parse(content.substring(0, index)) / parse(content.substring(index + 1));
    }

    if ("" == content) {
        return 0;
    } else {
        return content - 1 + 1;
    }
}
*/

var in_array = function (arr) {
    // 遍历是否在数组中
    for (var i = 0, k = arr.length; i < k; i++) {
        if (this == arr[i]) {
            return true;
        }
    }
    // 如果不在数组中就会返回false
    return false;
}
// 给字符串添加原型
String.prototype.in_array = in_array;

function parse(content) {
    function Stack() {

        /**
         * 用数组来模拟栈
         */
        var items = [];

        /**
         * 将元素送入栈，放置于数组的最后一位
         */
        this.push = function (element) {
            items.push(element);
        };

        /**
         * 弹出栈顶元素
         */
        this.pop = function () {
            return items.pop();
        };

        /**
         * 查看栈顶元素
         */
        this.peek = function () {
            return items[items.length - 1];
        }

        /**
         * 确定栈是否为空
         * @return {Boolean} 若栈为空则返回true,不为空则返回false
         */
        this.isAmpty = function () {
            return items.length === 0
        };

        /**
         * 清空栈中所有内容
         */
        this.clear = function () {
            items = [];
        };

        /**
         * 返回栈的长度
         * @return {Number} 栈的长度
         */
        this.size = function () {
            return items.length;
        };

        /**
         * 以字符串显示栈中所有内容
         */
        this.print = function () {
            return items.toString();
        };
    }
    function infixtoSuffix(data1) {
        var s = new Stack();
        var c, e1, e2, e3;
        //var data = "1+(2-3)*4+10/5";//原始字符串  
        var dataStr = new Array();
        for (var i = 0; i < data.length;) {
            if (data[i] >= '0' && data[i] <= '9') {
                if (data[i + 1] >= '0' && data[i + 1] <= '9') {
                    dataStr.push(data[i] + data[i + 1] + "");
                    dataStr.push(" ");
                    i = i + 2;
                } else {
                    dataStr.push(data[i]);
                    dataStr.push(" ");
                    i = i + 1;
                }
            }
            else if (data[i] == ')') {
                e1 = s.peek();
                s.pop();
                while (e1 != '(') {
                    dataStr.push(e1);
                    dataStr.push(" ");
                    e1 = s.peek();
                    s.pop();
                }
                i++;
            }
            else if (data[i] == '+' || data[i] == '-') {
                if (s.size() == 0) {
                    s.push(data[i]);
                }
                else {
                    do {
                        e2 = s.peek();
                        s.pop();
                        if (e2 == '(') {
                            s.push(e2);
                        } else {
                            dataStr.push(e2);
                            dataStr.push(" ");
                        }
                    } while (s.size() != 0 && e2 != '(');
                    s.push(data[i]);
                }
                i++;
            }
            else if (data[i] == '*' || data[i] == '/' || data[i] == '(') {
                s.push(data[i]);
                i++;
            }
            else {
                document.getElementById("p1").innerHTML = "Wrong!";
            }
        }
        while (s.size() != 0) {
            e3 = s.peek();
            s.pop();
            dataStr.push(e3);
            if (s.size() != 0) {
                dataStr.push(" ");
            }
        }
        return dataStr;
        //document.getElementById("p1").innerHTML =dataStr.length;
    }

    function calcSuffix(datastr1) {
        var s1 = new Stack();
        //var dataStr = "1 2 3 - 4 * + 10 5 / +";//原始字符串  
        //var datastr1 = datastr1.split(", ,");
        //var datastr1 = datastr1;
        var d, e;
        for (var i = 0; i < datastr1.length; i++) {
            if (datastr1[i] == ' ') {
                continue;
            }
            while (!isNaN(datastr1[i])) {
                d = parseFloat(datastr1[i]);
                s1.push(d);
                break;
            }
            switch (datastr1[i]) {
                case '+':
                    e = s1.peek();
                    s1.pop();
                    d = s1.peek();
                    s1.pop();
                    s1.push(d + e);
                    break;
                case '-':
                    e = s1.peek();
                    s1.pop();
                    d = s1.peek();
                    s1.pop();
                    s1.push(d - e);
                    break;
                case '*':
                    e = s1.peek();
                    s1.pop();
                    d = s1.peek();
                    s1.pop();
                    s1.push(d * e);
                    break;
                case '/':
                    e = s1.peek();
                    s1.pop();
                    d = s1.peek();
                    s1.pop();
                    s1.push(d / e);
                    break;
            }
        }
        //document.getElementById("p1").innerHTML = s1.peek();
        return s1.peek();
    }

    var data = content;
    var dataStr = infixtoSuffix(data);
    //document.getElementById("p1").innerHTML = dataStr.toString();
    var result = calcSuffix(dataStr);
    return result;

}