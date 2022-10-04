# Verilog 操作符

无法处理的数据是毫无用处的，在数字电路和计算机系统中总是需要某种形式的计算。这一讲我们来看看 Verilog 中的一些运算符，它们可以使综合工具以适当的硬件元素来实现。

## Verilog 算数运算符

如果除法或取模运算符的第二个操作数为零，则结果将为 `x` 。如果幂运算符的任一操作数为实数，则结果也将为实数。如果幂运算符的第二个操作数为 0 ( $a^0$ )，则结果将为 1。

|Operator|Description|
|-|-|
|`a + b`|a plus b|
|`a - b`|a minus b|
|`a * b`|a multiplied by b|
|`a / b`|a divided by b|
|`a % b`|a modulo b|
|`a ** b`|a to the power of b|

下面给出了如何使用算术运算符的一些示例。

```verilog
module des;
    reg [7:0]  data1;
    reg [7:0]  data2;

    initial begin
        data1 = 45;
        data2 = 9;

        $display ("Add + = %d", data1 + data2);
        $display ("Sub - = %d", data1 - data2);
        $display ("Mul * = %d", data1 * data2);
        $display ("Div / = %d", data1 / data2);
        $display ("Mod %% = %d", data1 % data2);
        $display ("Pow ** = %d", data2 ** 2);

    end
endmodule
```

仿真日志：

```bash
Add + =  54
Sub - =  36
Mul * = 149
Div / =   5
Mod % =   0
Pow ** =  81
```

## Verilog 关系运算符

关系运算符的表达式如果为真则返回 `1` ，如果为假则返回 `0`。如果任一操作数是 `x` 或 `z` ，则结果将为 `x` 。关系运算符的优先级低于算术运算符，并且所有关系运算符具有相同的优先级。

|Operator|Description|
|-|-|
|`a < b`|a less than b|
|`a > b`|a greater than b|
|`a <= b`|a less than or equal to b|
|`a >= b`|a greater than or equal to b|

```verilog
module des;
    reg [7:0]  data1;
    reg [7:0]  data2;

    initial begin
        data1 = 45;
        data2 = 9;
        $display ("Result for data1 >= data2 : %0d", data1 >= data2);

        data1 = 45;
        data2 = 45;
        $display ("Result for data1 <= data2 : %0d", data1 <= data2); data1 = 9; data2 = 8; $display ("Result for data1 > data2 : %0d", data1 > data2);

        data1 = 22;
        data2 = 22;
        $display ("Result for data1 < data2 : %0d", data1 < data2);
    end

endmodule
```

仿真日志：

```bash
Result for data1 >= data2 : 1
Result for data1 <= data2 : 1
Result for data1 > data2 : 1
Result for data1 < data2 : 0
```

### Verilog 等式运算符

等式运算符之间具有相同的优先级，并且优先级低于关系运算符。 如果为真，结果为 `1`，否则为 `0`。如果逻辑相等 (logical-equality ==) 或逻辑不等 (logical-inequality !=) 的任一操作数是 `x` 或 `z`，则结果将为 `x`。以使用情况相等运算符 (case-equality ===) 或情况不等运算符(case-inequality !==) 来匹配 `x` 和 `z` 并且始终返回已知值 0 或 1 ，不会返回未知值 `x` 。

|Operator|Description|
|-|-|
|`a === b`|a equal to b, including x and z|
|`a !== b`|a not equal to b, including x and z|
|`a == b`|a equal to b, result can be unknown|
|`a != b`|a not equal to b, result can be unknown|

```verilog
module des;
    reg [7:0]  data1;
    reg [7:0]  data2;

    initial begin
        data1 = 45;     data2 = 9;      $display ("Result for data1(%0d) === data2(%0d) : %0d", data1, data2, data1 === data2);
        data1 = 'b101x; data2 = 'b1011; $display ("Result for data1(%0b) === data2(%0b) : %0d", data1, data2, data1 === data2);
        data1 = 'b101x; data2 = 'b101x; $display ("Result for data1(%0b) === data2(%0b) : %0d", data1, data2, data1 === data2);
        data1 = 'b101z; data2 = 'b1z00; $display ("Result for data1(%0b) !== data2(%0b) : %0d", data1, data2, data1 !== data2);
        data1 = 39;     data2 = 39;     $display ("Result for data1(%0d) == data2(%0d) : %0d", data1, data2, data1 == data2);
        data1 = 14;     data2 = 14;     $display ("Result for data1(%0d) != data2(%0d) : %0d", data1, data2, data1 != data2);
    end
endmodule
```

仿真日志：

```verilog
Result for data1(45) === data2(9) : 0
Result for data1(101x) === data2(1011) : 0
Result for data1(101x) === data2(101x) : 1
Result for data1(101z) !== data2(1z00) : 1
Result for data1(39) == data2(39) : 1
Result for data1(14) != data2(14) : 0
```

## Verilog逻辑运算符

当两个操作数都为真或非零时，逻辑与 (&&) 的结果为 `1` 或真。当任一操作数为真或非零时，逻辑或 (||) 的结果为 `1` 或真。如果任一操作数是 `x`，那么结果也将是 `x`。逻辑否定 (!) 运算符会将非零或真操作数转换为 `0` ，将零或假操作数转换为 `1` ，而 `x` 将保持为 `x`。

|Operator|Description|
|-|-|
|`a && b`|evaluates to true if a and b are true|
|`a || b`|evaluates to true if a or b are true|
|`!a`|Converts non-zero value to zero, and vice versa|

```verilog
module des;
    reg [7:0]  data1;
    reg [7:0]  data2;

    initial begin
        data1 = 45;     data2 = 9; $display ("Result of data1(%0d) && data2(%0d) : %0d", data1, data2, data1 && data2);
        data1 = 0;      data2 = 4; $display ("Result of data1(%0d) && data2(%0d) : %0d", data1, data2, data1 && data2);
        data1 = 'dx;    data2 = 3; $display ("Result of data1(%0d) && data2(%0d) : %0d", data1, data2, data1 && data2);
        data1 = 'b101z; data2 = 5; $display ("Result of data1(%0d) && data2(%0d) : %0d", data1, data2, data1 && data2);
        data1 = 45;     data2 = 9; $display ("Result of data1(%0d) || data2(%0d) : %0d", data1, data2, data1 || data2);
        data1 = 0;      data2 = 4; $display ("Result of data1(%0d) || data2(%0d) : %0d", data1, data2, data1 || data2);
        data1 = 'dx;    data2 = 3; $display ("Result of data1(%0d) || data2(%0d) : %0d", data1, data2, data1 || data2);
        data1 = 'b101z; data2 = 5; $display ("Result of data1(%0d) || data2(%0d) : %0d", data1, data2, data1 || data2);
        data1 = 4;                 $display ("Result of !data1(%0d) : %0d", data1, !data1);
        data1 = 0;                 $display ("Result of !data1(%0d) : %0d", data1, !data1);
    end
endmodule
```

仿真日志：

```verilog
Result of data1(45) && data2(9) : 1
Result of data1(0) && data2(4) : 0
Result of data1(x) && data2(3) : x
Result of data1(Z) && data2(5) : 1
Result of data1(45) || data2(9) : 1
Result of data1(0) || data2(4) : 1
Result of data1(x) || data2(3) : 1
Result of data1(Z) || data2(5) : 1
Result of !data1(4) : 0
Result of !data1(0) : 1
```

## Verilog 位运算符

该运算符将一个操作数中的位与另一个操作数中的相应位组合以计算单个位结果。

|&|0|1|x|z|
|:-:|:-:|:-:|:-:|:-:|
|**0**|0|0|0|0|
|**1**|0|1|x|x|
|**x**|0|x|x|x|
|**z**|0|x|x|x|

|`|`|0|1|x|z|
|**0**|0|1|x|x|
|**1**|1|1|1|1|
|**x**|x|1|x|x|
|**z**|x|1|x|x|

```verilog
module des;
    reg 		 data1 [4] ;
    reg 		 data2 [4] ;
    integer		 i, j;

    initial begin
        data1[0] = 0;  data2[0] = 0;
        data1[1] = 1;  data2[1] = 1;
        data1[2] = 'x; data2[2] = 'x;
        data1[3] = 'z; data2[3] = 'z;

        for (i = 0; i < 4; i += 1) begin
            for (j = 0; j < 4; j += 1) begin
                $display ("data1(%0d) & data2(%0d) = %0d", data1[i], data2[j], data1[i] & data2[j]);
            end
        end
    end
endmodule
```

仿真日志：

```verilog
data1(0) & data2(0) = 0
data1(0) & data2(1) = 0
data1(0) & data2(x) = 0
data1(0) & data2(z) = 0
data1(1) & data2(0) = 0
data1(1) & data2(1) = 1
data1(1) & data2(x) = x
data1(1) & data2(z) = x
data1(x) & data2(0) = 0
data1(x) & data2(1) = x
data1(x) & data2(x) = x
data1(x) & data2(z) = x
data1(z) & data2(0) = 0
data1(z) & data2(1) = x
data1(z) & data2(x) = x
data1(z) & data2(z) = x
```

## Verilog 移位运算符

有两种移位运算符：

- 逻辑移位运算符： `<<` 和 `>>`
- 算术移位运算符： `<<<` 和 `>>>`

```verilog
module des;
    reg [7:0] data;
    int       i;

    initial begin
        data = 8'h1;
        $display ("Original data = 'd%0d or 'b%0b", data, data);
        for (i = 0; i < 8; i +=1 ) begin
            $display ("data << %0d = 'b%b", i, data << i);
        end

        data = 8'h80;
        $display ("Original data = 'd%0d or 'b%0b", data, data);
        for (i = 0; i < 8; i +=1 ) begin 
            $display ("data >> %0d = 'b%b", i, data >> i);
        end

        data = 8'h1;
        $display ("data >> 1 = 'b%b", data >> 1);
    end
endmodule
```

仿真日志：

```bash
Original data = 'd1 or 'b00000001
data << 0 = 'b00000001
data << 1 = 'b00000010
data << 2 = 'b00000100
data << 3 = 'b00001000
data << 4 = 'b00010000
data << 5 = 'b00100000
data << 6 = 'b01000000
data << 7 = 'b10000000
Original data = 'd128 or 'b10000000
data >> 0 = 'b10000000
data >> 1 = 'b01000000
data >> 2 = 'b00100000
data >> 3 = 'b00010000
data >> 4 = 'b00001000
data >> 5 = 'b00000100
data >> 6 = 'b00000010
data >> 7 = 'b00000001
data >> 1 = 'b00000000
```

