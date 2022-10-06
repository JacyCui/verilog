# Verilog 赋值

将值放在导线和变量上称为赋值。有以下三种基本形式：

- 过程式(procedural)
- 持续性(continuous)
- 过程式持续性(procedural continuous)

## 合法左值

赋值有两个部分 - 右侧 (RHS) 和左侧 (LHS)，中间有一个等号 (=) 或一个小于等号 (<=)。

|赋值类型|左值|
|-|-|
|过程式|变量（标量/向量）<br/>变量向量、整数或者时间的位选择和部分选择<br/>内存字(memory word)<br/>上述任意内容的拼接|
|持续性|导线（向量/标量）<br/>导线向量的位选择或者部分选择<br/>上述内容的拼接|
|过程式持续性|导线或者变量（标量/向量）<br/>导线向量的位选择和部分选择|

RHS 可以包含计算结果为最终值的任何表达式，而 LHS 表示将 RHS 中的值赋给的导线或变量。

```verilog
module tb;
    reg clk;
    wire a, b, c, d, e, f;
    reg  z, y;

    // clk is on the LHS and the not of clk forms RHS
    always #10 clk = ~clk;

    // y is the LHS and the constant 1 is RHS
    assign y = 1;

    // f is the LHS, and the expression of a,b,d,e forms the RHS
    assign f = (a | b) ^ (d & e);

    always @ (posedge clk) begin
        // z is the LHS, and the expression of a,b,c,d forms the RHS
        z <= a + b + c + d;
    end

    initial begin
        // Variable names on the left form LHS while 0 is RHS
        a <= 0; b <= 0; c <= 0; d <= 0; e <= 0;
        clk <= 0;
    end
endmodule
```

## 过程式赋值

过程赋值发生在过程中，例如 `always` 、 `initial` 、 `task` 和 `functions` ，用于将值赋给变量。该变量将保持该值，直到下一次分配给同一变量。

当模拟器在仿真期间的某个时间点执行此语句时，该值将被放置到变量上。这可以通过使用控制流语句（如 `if-else-if` 、 `case` 语句和循环机制）以我们想要的方式进行控制和修改。

```verilog
reg [7:0]  data;
integer    count;
real       period;

initial begin
	data = 8'h3e;
	period = 4.23;
	count = 0;
end

always @ (posedge clk)
	count++;
```

### 变量声明赋值

初始值可以在声明时放置到变量上，如下所示。初始值会一直保持，直到对同一变量进行下一次赋值。请注意，不允许对数组声明赋初值。

```verilog
module my_block;
	reg [31:0] data = 32'hdead_cafe;

	initial begin
		#20  data = 32'h1234_5678;    // data will have dead_cafe from time 0 to time 20
	                                  // At time 20, data will get 12345678
	end
endmodule
```

```verilog
reg [3:0] a = 4'b4;

// is equivalent to

reg [3:0] a;
initial a = 4'b4;
```

如果变量在声明期间和初始块(initial block)中的时间 0 都有初始化，如下所示，则无法保证赋值生效的时间顺序，因此变量值可能是 `8'h05` 或 `8'hee` ，这是不确定的。

```verilog
module my_block;
	reg [7:0]  addr = 8'h05;

	initial
        addr = 8'hee;
endmodule
```

```verilog
reg [3:0] array [3:0] = 0;           // illegal
integer i = 0, j;                    // declares two integers i,j and i is assigned 0
real r2 = 4.5, r3 = 8;               // declares two real numbers r2,r3 and are assigned 4.5, 8 resp.
time startTime = 40;                 // declares time variable with initial value 40
```

过程式的程序块以及其中的赋值在后面的章节中更详细地介绍。

## 持续性赋值

这用于将值给导线标量和导线向量赋值，并在 RHS 发生变化时随之改变。它提供了一种在不指定门互连的情况下对组合逻辑进行建模的方法，并使得用逻辑表达式驱动导线变得更加容易。

```verilog
// Example model of an AND gate
wire  a, b, c;

assign a = b & c;
```

每当 `b` 或 `c` 更改其值时，将评估(evaluate) RHS 中的整个表达式，并使用新值更新 `a` 。

### 导线声明赋值

这允许我们在声明导线的同一语句上放置连续赋值。请注意，由于导线只能声明一次，因此它只能进行一次声明赋值。

```verilog
wire  penable = 1;
```

## 过程式连续性赋值

这些是允许将表达式连续分配给导线或变量的过程式语句，有两种类型：

- `assign` ... `deassign`
- `force` ... `release`

### assign - deassign

这将覆盖对变量的所有过程式赋值，并通过 `deassign` 该变量来停用。变量的值将保持不变，直到变量通过过程式或过程式连续性赋值获得新值。赋值语句的 LHS 不能是位选择、部分选择或数组引用，但可以是变量或变量的拼接。

```verilog
reg q;

initial begin
	assign q = 0;
	#10 deassign q;
end
```

### force - release

这些类似于 `assign - deassign` 语句，但可以应用于导线和变量。 LHS 可以是导线的位选择、导线的部分选择、变量或导线，但不能是数组的引用和变量的位/部分选择。 `force` 语句将覆盖对变量所做的所有其他分配，直到使用 `release` 关键字释放它。

```verilog
reg o, a, b;

initial begin
	force o = a & b;
	// ...
	release o;
end
```




