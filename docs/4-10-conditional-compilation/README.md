# Verilog 条件编译

Verilog 支持一些编译器指令，这些指令可以指导编译器以某种方式处理代码。例如，代码的一部分可能代表某个功能的实现，如果不使用该功能，则应该有某种方式不将代码包含在设计中。

这可以通过条件编译来解决，其中设计人员可以将代码包装在编译器指令中，这些指令告诉编译器在设置给定的命名标志处包含或排除要编译的代码。

## 语法

条件编译可以通过 Verilog 的 `ifdef` 和 `ifndef` 关键字来实现。这些关键字可以出现在设计中的任何位置，并且可以嵌套在另一个内部。

```verilog
// Style #1: Only single `ifdef
`ifdef <FLAG>
	// Statements
`endif

// Style #2: `ifdef with `else part
`ifdef <FLAG>
	// Statements
`else
	// Statements
`endif

// Style #3: `ifdef with additional ifdefs
`ifdef <FLAG1>
	// Statements
`elsif <FLAG2>
	// Statements
`elsif <FLAG3>
	// Statements
`else
	// Statements
`endif
```

关键字 `ifdef` 只是告诉编译器，直到下一个 `else` 或 `endif` ，如果给定的名为 `FLAG` 的宏是使用 `define` 指令定义的，则包含这段代码，

> 注：这里的关键字之前需要加一个反引号，因为这是markdown的保留符号，我没办法在正文里面写出这个符号。

## 带有条件编译的设计示例

```verilog
module my_design (input clk, d,
`ifdef INCLUDE_RSTN
                  input rstn,
`endif
                  output reg q);

    always @ (posedge clk) begin
`ifdef INCLUDE_RSTN
        if (!rstn) begin
            q <= 0;
        end else
`endif
        begin
            q <= d;
        end
    end
endmodule
```

### 测试台

```verilog
module tb;
    reg clk, d, rstn;
    wire q;
    reg [3:0] delay;

    my_design u0 ( .clk(clk), .d(d),
`ifdef INCLUDE_RSTN
                    .rstn(rstn),
`endif
                    .q(q));

    always #10 clk = ~clk;

    initial begin
        integer i;

        {d, rstn, clk} <= 0;

        #20 rstn <= 1;
        for (i = 0 ; i < 20; i=i+1) begin
            delay = $random;
            #(delay) d <= $random;
        end

        #20 $finish;
    end
endmodule
```

请注意，默认情况下，`rstn` 在设计编译期间不会包含在内，因此它不会出现在端口列表中。但是，如果一个名为 `INCLUDE_RSTN` 的宏在作为文件编译列表一部分的任何 Verilog 文件中定义或通过命令行传递给编译器，则 `rstn` 将包含在编译中，并且设计模块将拥有这个端口。

## Verilog ifdef elsif 示例

以下示例在单独的 `ifdef` 范围内有两个显示语句，它们没有默认的 `else` 部分。所以这意味着默认情况下不会显示任何内容。如果定义了 `MACRO1` 或者 `MACRO2` ，则包含相应的显示消息，并将在模拟过程中显示。

```verilog
module tb;
    initial begin

`ifdef MACRO1
        $display ("This is MACRO1");

`elsif MACRO2
        $display ("This is MACRO2");

`endif
    end
endmodule
```

仿真日志：

```bash
# With no macros defined

# With +define+MACRO1
This is MACRO1

# With +define+MACRO2
This is MACRO2
```

## Verilog ifndef elsif 示例

可以使用 `ifndef` 编写相同的代码，结果正好相反。

```verilog
module tb;
    initial begin

`ifndef MACRO1
        $display ("This is MACRO1");

`elsif MACRO2
        $display ("This is MACRO2");

`endif
    end
endmodule
```

仿真日志：

```verilog
# With no macros defined
This is MACRO1

# With +define+MACRO1

# With +define+MACRO2
This is MACRO1

# With +define+MACRO1 +define+MACRO2
This is MACRO2
```

## Verilog 嵌套 ifdef 示例

`ifdef` 可以嵌套在另一个中，以使用已定义的宏创建复杂的代码包含和排除逻辑。

```verilog
module tb;
    initial begin
`ifdef FLAG
        $display ("FLAG is defined");
`ifdef NEST1_A
        $display ("FLAG and NEST1_A are defined");
`ifdef NEST2
        $display ("FLAG, NEST1_A and NEST2 are defined");
`endif
`elsif NEST1_B
        $display ("FLAG and NEST1_B are defined");
`ifndef WHITE
        $display ("FLAG and NEST1_B are defined, but WHITE is not");
`else
        $display ("FLAG, NEST1_B and WHITE are defined");
`endif
`else
        $display ("Only FLAG is defined");
`endif
`else
        $display ("FLAG is not defined");
`endif
    end
endmodule
```

仿真日志：

```bash
FLAG is not defined

# With +define+FLAG +define+NEST1_B
FLAG is defined
FLAG and NEST1_B are defined
FLAG and NEST1_B are defined, but WHITE is not

# With +define+FLAG +define+NEST1_B +define+WHITE
FLAG is defined
FLAG and NEST1_B are defined
FLAG, NEST1_B and WHITE are defined

# With +define+FLAG
FLAG is defined
Only FLAG is defined

# With +define+WHITE
FLAG is not defined

# With +define+NEST1_A
FLAG is not defined
```

注意，只要未定义父宏，就不会编译其中任何其他嵌套宏的定义。例如，没有 `FLAG` ， `NEST1_A` 或 `WHITE` 宏定义不会使编译器拾取嵌套代码。

