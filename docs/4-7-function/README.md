# Verilog 函数

我们经常发现某些代码片段在 RTL 中重复并被多次调用。它们大多不消耗模拟时间，并且可能涉及需要使用不同数据值完成的复杂计算。在这种情况下，我们可以声明一个函数并将重复的代码放在函数中并让它返回结果。这将大大减少 RTL 中的行数，因为您现在需要做的就是进行函数调用并传递需要执行计算的数据。实际上，这与 C 中的函数非常相似。

函数的目的是返回要在表达式中使用的值。函数定义总是以关键字 `function` 开头，后跟返回类型、名称和括在括号中的端口列表。当 Verilog 找到 `endfunction` 关键字时，就知道函数定义结束了。请注意，一个函数应至少声明一个输入，如果该函数不返回任何内容，则返回类型将为 `void` 。

## 语法

```verilog
function [automatic] [return_type] name ([port_list]);
	[statements]
endfunction
```

关键字 `automatic` 将使函数可重入(reentrant)，并且在任务中声明的项目是动态分配的，而不是在任务的不同调用之间共享。这对于递归函数以及当同一个函数在分叉时由 N 个进程同时执行时很有用。

## 函数声明

有两种方法可以声明函数的输入：

```verilog
function [7:0] sum;
	input [7:0] a, b;
	begin
		sum = a + b;
	end
endfunction

function [7:0] sum (input [7:0] a, b);
	begin
		sum = a + b;
	end
endfunction
```

## 函数返回值

函数定义将隐式创建一个与函数同名的内部变量。因此，在函数范围内声明另一个同名变量是非法的。通过将函数结果赋给内部同名变量来初始化返回值。

```verilog
sum = a + b;
```

## 函数调用

函数调用的语法如下所示。

```verilog
reg [7:0] result;
reg [7:0] a, b;

initial begin
	a = 4;
	b = 5;
	#10 result = sum (a, b);
end
```

## 函数的规则

- 函数不能包含任何时间控制的语句，例如 `#` 、 `@` 、 `wait`、 `posedge`、 `negedge` ；
- 函数无法启动 `task` ，因为它可能会消耗模拟时间，但可以调用其他函数；
- 一个函数应该至少有一个输入；
- 函数不能有非阻塞赋值或 `force-release` 或 `assign-deassign` ；
- 函数不能有任何触发器；
- 函数不能有 `output` 或 `inout` 端口。

## 递归函数

调用自身的函数称为递归函数。在下面显示的示例中，编写了一个递归函数来计算给定数字的阶乘。

```verilog
module tb;
    integer result;

    initial begin
        result = factorial(4);
        $display("factorial(4) = %0d", result);
    end

	function automatic integer factorial(input integer i);
        // This function is called within the body of this
        // function with a different argument
        if (i) begin
            factorial = i * factorial(i-1);
            $display("i=%0d result=%0d", i, factorial);
        end else begin
            factorial = 1;
        end
	endfunction
endmodule
```

仿真日志：

```verilog
i=1 result=1
i=2 result=2
i=3 result=6
i=4 result=24
factorial(4) = 24
```




