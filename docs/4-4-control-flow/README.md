# Verilog 控制块

如果没有条件语句和其他控制逻辑流的方法，就无法实现硬件行为的描述。 Verilog 有一组控制流块和机制来实现相同的功能。

## if-else-if

该条件语句用于决定是否应该执行某些语句。这与 C 中的 `if-else-if` 语句非常相似。如果表达式的计算结果为 true，则将执行第一条语句。如果表达式的计算结果为 false 并且如果存在 `else` 部分，则将执行 `else` 部分。

### 语法

```verilog
// if statement without else part
if (expression)
	[statement]

// if statment with an else part
if (expression)
	[statement]
else
	[statement]

// if else for multiple statements should be
// enclosed within "begin" and "end"
if (expression) begin
	[multiple statements]
end else begin
	[multiple statements]
end

// if-else-if statement
if (expression)
	[statement]
else if (expression)
	[statement]
else
	[statement]
```

`if-else` 的 `else` 部分是可选的。 `else` 可以省略，多个 `if` 嵌套的时候， `else` 与最近的 `if` 匹配，可以通过 `begin-end` 来调整 `else` 与哪个 `if` 匹配。

循环提供了一种在块内多次执行单个或多个语句的方法。 Verilog 中有四种不同类型的循环语句。

## forever 循环

这将连续执行块内的语句。

```verilog
forever
	[statement]

forever begin
	[multiple statements]
end
```

### 示例

```verilog
module my_design;
	initial begin
		forever begin
			$display ("This will be printed forever, simulation can hang ...");
		end
	end
endmodule
```

仿真日志：

```bash
This will be printed forever, simulation can hang ...
This will be printed forever, simulation can hang ...
...
...
This will be printed forever, simulation can hang ...
This will be printed forever, simulation can hang ...
This will be printed forever, simulation can hang ...
This will be printed forever, simulation can hang ...
Result reached the maximum of 5000 lines. Killing process.
```

## repeat 循环

这将执行语句特定次。如果表达式的计算结果为 `X` 或 `Z`，那么它将被视为零并且后续的语句块不会执行。

```verilog
repeat ([num_of_times]) begin
	[statements]
end

repeat ([num_of_times]) @ ([some_event]) begin
	[statements]
end
```

### 示例

```verilog
module my_design;
	initial begin
		repeat(4) begin
			$display("This is a new iteration ...");
		end
	end
endmodule
```

仿真日志：

```bash
This is a new iteration ...
This is a new iteration ...
This is a new iteration ...
This is a new iteration ...
```

## while 循环

只要表达式为真，就会执行语句，并在条件变为假时退出循环。如果条件从一开始就为假，则不会执行语句。

```verilog
while (expression) begin
	[statements]
end
```

示例：

```verilog
module my_design;
  	integer i = 5;

	initial begin
      while (i > 0) begin
        $display ("Iteration#%0d", i);
        i = i - 1;
      end
	end
endmodule
```

仿真日志：

```verilog
Iteration#5
Iteration#4
Iteration#3
Iteration#2
Iteration#1
```

## for 循环

```verilog
for (initial_assignment; condition; increment_variable) begin
	[statements]
end
```

这个语句的执行步骤为：

- 初始化循环计数器变量；
- 计算表达式，通常涉及循环计数器变量；
- 增加循环计数器变量，以便稍后表达式将变为假并且循环将退出。

和C中的for循环基本一致。

### 示例

```verilog
module my_design;
  	integer i = 5;

	initial begin
        for (i = 0; i < 5; i = i + 1) begin
            $display ("Loop #%0d", i);
        end
    end
endmodule
```

仿真日志：

```bash
Loop #0
Loop #1
Loop #2
Loop #3
Loop #4
```



