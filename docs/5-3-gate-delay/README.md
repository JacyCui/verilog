# Verilog 门级延迟

数字元件是二进制实体，只能保存两个值中的任何一个 - 0 和 1。但是，从 0 到 1 和从 1 到 0 的转换有一个转换延迟，每个门元素将值从输入传播到其输出的时候也是类似的，存在延迟。

例如，如果两个输入都变为 1，则双输入 AND 门必须将输出切换为 1，当其任何输入变为 0 时，必须将输出切换回 0。这些门和引脚到引脚的延迟可以在实例化逻辑原语时在 Verilog 中指定。

## 上升、下降和关闭延迟

门的输出从某个值变为 1 所需的时间称为上升延迟。门的输出从某个值变为 0 所需的时间称为下降延迟。门的输出从某个值变为高阻抗所需的时间称为关闭延迟。

这些延迟实际上适用于任何信号，因为它们都可以在实际电路中随时上升或下降，而不仅限于门的输出。有三种表示门延迟的方法，两种延迟格式可以应用于大多数输出​​不会转换为高阻抗的基元。就像三延迟格式不能应用于与门一样，因为对于任何输入组合，输出都不会转到 `z` 。

```verilog
// Single delay specified - used for all three types of transition delays
or #(<delay>) o1 (out, a, b);

// Two delays specified - used for Rise and Fall transitions
or #(<rise>, <fall>) o1 (out, a, b);

// Three delays specified - used for Rise, Fall and Turn-off transitions
or #(<rise>, <fall>, <turn_off>) o1 (out, a, b);
```

如果仅指定一个延迟，则所有三种类型的延迟将使用相同的给定值。如果指定了两个延迟，第一个代表上升，第二个代表下降延迟。如果指定了三个延迟，它们分别代表上升、下降和关闭延迟。

### 单延迟形式

```verilog
module des (input 	a, b,
            output  out1, out2);

	// AND gate has 2 time unit gate delay
    and 		#(2) o1 (out1, a, b);

    // BUFIF0 gate has 3 time unit gate delay
    bufif0 	#(3) b1 (out2, a, b);

endmodule
```

```verilog
module tb;
    reg a, b;
    wire out1, out2;

    des d0 (.out1(out1), .out2(out2), .a(a), .b(b));

    initial begin
        {a, b} <= 0;

        $monitor ("T=%0t a=%0b b=%0b and=%0b bufif0=%0b", $time, a, b, out1, out2);

        #10 a <= 1;
        #10 b <= 1;
        #10 a <= 0;
        #10 b <= 0;
    end
endmodule
```

看到与门的输出在其输入之一改变后2 个时间单位改变了。例如，`b` 变为 1，而 `a` 在 T=20 时已经为 1，但输出仅在 T=22 时变为 1。类似地，`a` 在 T=30 处回到零，输出在 T=32 处获得新值。

对于 BUFIF0，门延迟指定为 3 个时间单位，因此当 `b` 从 0 变为 1 而 `a` 已经为 1 时，输出需要 3 个时间单位才能更新到 Z，最后在 T=23 时更新。

仿真日志：

```bash
T=0 a=0 b=0 and=x bufif0=x
T=2 a=0 b=0 and=0 bufif0=x
T=3 a=0 b=0 and=0 bufif0=0
T=10 a=1 b=0 and=0 bufif0=0
T=13 a=1 b=0 and=0 bufif0=1
T=20 a=1 b=1 and=0 bufif0=1
T=22 a=1 b=1 and=1 bufif0=1
T=23 a=1 b=1 and=1 bufif0=z
T=30 a=0 b=1 and=1 bufif0=z
T=32 a=0 b=1 and=0 bufif0=z
T=40 a=0 b=0 and=0 bufif0=z
T=43 a=0 b=0 and=0 bufif0=0
```

### 双延迟形式

让我们将上面的相同测试平台应用于下面显示的不同 Verilog 模型，其中明确了上升和下降延迟。

```verilog
module des (input 	a, b,
            output  out1, out2);

    and #(2, 3) o1 (out1, a, b);
    bufif0 #(4, 5) b1 (out2, a, b);

endmodule
```

仿真日志：

```bash
T=0 a=0 b=0 and=x bufif0=x
T=3 a=0 b=0 and=0 bufif0=x
T=5 a=0 b=0 and=0 bufif0=0
T=10 a=1 b=0 and=0 bufif0=0
T=14 a=1 b=0 and=0 bufif0=1
T=20 a=1 b=1 and=0 bufif0=1
T=22 a=1 b=1 and=1 bufif0=1
T=24 a=1 b=1 and=1 bufif0=z
T=30 a=0 b=1 and=1 bufif0=z
T=33 a=0 b=1 and=0 bufif0=z
T=40 a=0 b=0 and=0 bufif0=z
T=45 a=0 b=0 and=0 bufif0=0
```

### 三延迟形式

```verilog
module des (input 	a, b,
            output out1, out2);

    and #(2, 3) o1 (out1, a, b);
    bufif0 #(5, 6, 7) b1 (out2, a, b);

endmodule
```

仿真日志：

```bash
T=0 a=0 b=0 and=x bufif0=x
T=3 a=0 b=0 and=0 bufif0=x
T=6 a=0 b=0 and=0 bufif0=0
T=10 a=1 b=0 and=0 bufif0=0
T=15 a=1 b=0 and=0 bufif0=1
T=20 a=1 b=1 and=0 bufif0=1
T=22 a=1 b=1 and=1 bufif0=1
T=27 a=1 b=1 and=1 bufif0=z
T=30 a=0 b=1 and=1 bufif0=z
T=33 a=0 b=1 and=0 bufif0=z
T=40 a=0 b=0 and=0 bufif0=z
T=46 a=0 b=0 and=0 bufif0=0
```

## Min/Typ/Max 延迟

所制造芯片的不同部分的延迟不同，不同温度和其他变化的延迟也不相同。因此 Verilog 还为上述每种延迟类型提供了额外的控制级别。每个数字门和晶体管单元都具有基于工艺节点指定的最小(minimum)、典型(typical)和最大(maximum)延迟，并且通常由制造厂的库提供。

对于每种类型的延迟 - 上升、下降和关闭 - 可以指定三个值 `min` 、 `typ` 和 `max` ，它们分别代表最小、典型和最大延迟。

```verilog
module des (input 	a, b,
            output  out1, out2);

    and #(2:3:4, 3:4:5) o1 (out1, a, b);
    bufif0 #(5:6:7, 6:7:8, 7:8:9) b1 (out2, a, b);

endmodule
```

仿真日志：

```bash
T=0 a=0 b=0 and=x bufif0=x
T=4 a=0 b=0 and=0 bufif0=x
T=7 a=0 b=0 and=0 bufif0=0
T=10 a=1 b=0 and=0 bufif0=0
T=16 a=1 b=0 and=0 bufif0=1
T=20 a=1 b=1 and=0 bufif0=1
T=23 a=1 b=1 and=1 bufif0=1
T=28 a=1 b=1 and=1 bufif0=z
T=30 a=0 b=1 and=1 bufif0=z
T=34 a=0 b=1 and=0 bufif0=z
T=40 a=0 b=0 and=0 bufif0=z
T=47 a=0 b=0 and=0 bufif0=0
```


