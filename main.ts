input.onButtonPressed(Button.A, function () {
    basic.showLeds(`
        . . # . .
        . . . # .
        . . . . #
        . . . # .
        . . # . .
        `)
    XRbit_Trolley.SetMotor(XRbit_Trolley.enMotor.leftMotor, 54)
    XRbit_Trolley.SetMotor(XRbit_Trolley.enMotor.rightMotor, 52)
})
radio.onReceivedString(function (receivedString) {
    if (receivedString == "f") {
        basic.showLeds(`
            . . # . .
            . . . # .
            . . . . #
            . . . # .
            . . # . .
            `)
        XRBIT.SetMotor(XRBIT.motor.M1, XRBIT.speed.fwd_50)
        XRBIT.SetMotor(XRBIT.motor.M2, XRBIT.speed.fwd_50)
    }
    if (receivedString == "b") {
        basic.showLeds(`
            . . # . .
            . # . . .
            # . . . .
            . # . . .
            . . # . .
            `)
        XRBIT.SetMotor(XRBIT.motor.M1, XRBIT.speed.stop)
        XRBIT.SetMotor(XRBIT.motor.M2, XRBIT.speed.stop)
    }
    if (receivedString == "r") {
        basic.showLeds(`
            . . . . .
            . . . . .
            # . . . #
            . # . # .
            . . # . .
            `)
    }
    if (receivedString == "l") {
        basic.showLeds(`
            . . # . .
            . # . # .
            # . . . #
            . . . . .
            . . . . .
            `)
    }
})
input.onButtonPressed(Button.B, function () {
    basic.showLeds(`
        . . # . .
        . # . . .
        # . . . .
        . # . . .
        . . # . .
        `)
    XRbit_Trolley.SetMotor(XRbit_Trolley.enMotor.leftMotor, 0)
    XRbit_Trolley.SetMotor(XRbit_Trolley.enMotor.rightMotor, 0)
})
namespace XRbit_sensor {

    export enum enVoice {
        //% blockId="Voice" block="Voice"
        Voice = 0,
        //% blockId="NoVoice" block="NoVoice"
        NoVoice = 1
    }

    export enum enIR {
        //% blockId="Get" block="Get"
        Get = 0,
        //% blockId="NoVoice" block="NoVoice"
        NoGet = 1
    }

    export enum enLight {
        //% blockId="Open" block="Open"
        Open = 0,
        //% blockId="Close" block="Close"
        Close = 1
    }

    export enum enBuzzer {
        //% blockId="NoBeep" block="NoBeep"
        NoBeep = 0,
        //% blockId="Beep" block="Beep"
        Beep
    }
    export enum irPin {
        //% blockId="ir_Left" block="Left_IR_P12"
        ir_Left = 1,
        //% blockId="ir_Right" block="Right_IR_P14"
        ir_Right = 2,
        //% blockId="ir_Avoid" block="Avoid_IR_P13"
        ir_Avoid = 3
    }


    //% blockId=XRbit_Buzzer block="Buzzer|pin %pin|value %value"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% value.min=0 value.max=1
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Buzzer(pin: DigitalPin, value: enBuzzer): void {
        pins.setPull(pin, PinPullMode.PullNone);
        pins.digitalWritePin(pin, value);
    }

    //% blockId=XRbit_IR_Sensor block="IR_Sensor|pin %pin| |%value|obstacle"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function IR_Sensor(pin: irPin, value: enIR): boolean {
        let Pin:DigitalPin;
        if(pin==1)
        {
            Pin = DigitalPin.P12;
        }
        if(pin==2)
        {
            Pin = DigitalPin.P14;
        }
        if(pin==3)
        {
            Pin = DigitalPin.P13;
        }

        pins.setPull(Pin, PinPullMode.PullUp);
        if (pins.digitalReadPin(Pin) == value) {
            return true;
        }
        else {
            return false;
        }
    }

    //% blockId=XRbit_Car_Ligth block="Car_Ligth |pin %pin| |%value|Headlight"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Car_Ligth(pin: DigitalPin, value: enLight): boolean {
        pins.setPull(pin, PinPullMode.PullUp);
        if (pins.digitalReadPin(pin) == value) {
            return true;
        }
        else {
            return false;
        }
    }

    //% blockId=XRbit_ultrasonic block="Ultrasonic|Trig %Trig|Echo %Echo"
    //% color="#87CEEB"
    //% weight=100
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Ultrasonic(Trig: DigitalPin, Echo: DigitalPin): number {
        // send pulse
        let list:Array<number> = [0, 0, 0, 0, 0];
        for (let i = 0; i < 5; i++) {
            pins.setPull(Trig, PinPullMode.PullNone);
            pins.digitalWritePin(Trig, 0);
            control.waitMicros(2);
            pins.digitalWritePin(Trig, 1);
            control.waitMicros(15);
            pins.digitalWritePin(Trig, 0);

            let d = pins.pulseIn(Echo, PulseValue.High, 43200);
            list[i] = Math.floor(d / 40)
        }
        list.sort();
        let length = (list[1] + list[2] + list[3])/3;
        return  Math.floor(length);
    }
}
namespace XRbit_Trolley {
    const XRBIT_ADDRESS = 0x17
    let xrStrip: neopixel.Strip;
    export enum enMotor {
        //% blockId="leftMotor" block="leftMotor"
        leftMotor = 0x14,
        //% blockId="rightMotor" block="rightMotor"
        rightMotor = 0x15
    }

    export enum IRValue {
        Power = 0x45,
        Menu = 0x47,
        Test = 0x44,
        Plus = 0x40,
        Return = 0x43,
        Left = 0x07,
        Play = 0x15,
        Right = 0x09,
        Num0 = 0x16,
        Minus = 0x19,
        Cancle = 0x0D,
        Num1 = 0x0C,
        Num2 = 0x18,
        Num3 = 0x5E,
        Num4 = 0x08,
        Num5 = 0x1C,
        Num6 = 0x5A,
        Num7 = 0x42,
        Num8 = 0x52,
        Num9 = 0x4A 
         
    }

    function i2cwrite(addr: number, reg: number, value: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function i2cread(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }
    //% blockId=XRbit_SetMotor block="SetMotor|Motor %Motor|Speed %Speed"
    //% weight=94
    //% blockGap=10
    //% color="#0fbc11"
    //% Speed.min=-100 Speed.max=100
    export function SetMotor(Motor: enMotor, Speed: number): void {
        let buf1 = pins.createBuffer(2);
        let buf2 = pins.createBuffer(2);
        buf1[0] = 0xFF;
        buf1[1] = Motor;
        buf2[0] = Speed+100;
        buf2[1] = 0xFF;
        pins.i2cWriteBuffer(XRBIT_ADDRESS,buf1);
        pins.i2cWriteBuffer(XRBIT_ADDRESS,buf2);
    }

    //% blockId=XRBIT_SetServoAngle block="SetServoAngle|Num %Num|Angle %Angle"
    //% weight=94
    //% blockGap=10
    //% color="#0fbc11"
    //% Num.min=1 Num.max=8 Angle.min=0 Angle.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=9
    export function SetServoAngle(Num: number, Angle: number): void {
        let buf12 = pins.createBuffer(2);
        let buf22 = pins.createBuffer(2);
        buf12[0] = 0xFF;
        buf12[1] = Num;
        buf22[0] = Angle;
        buf22[1] = 0xFF;
        pins.i2cWriteBuffer(XRBIT_ADDRESS,buf12);
        pins.i2cWriteBuffer(XRBIT_ADDRESS,buf22);
    }

    //% blockId=XRBIT_ReSetServoAngle block="ReSetServoAngle"
    //% weight=94
    //% blockGap=10
    //% color="#0fbc11"
    export function ReSetServoAngle(): void {
        let buf13 = pins.createBuffer(2);
        let buf23 = pins.createBuffer(2);
        buf13[0] = 0xFF;
        buf13[1] = 0x00;
        buf23[0] = 0x01;
        buf23[1] = 0xFF;
        pins.i2cWriteBuffer(XRBIT_ADDRESS,buf13);
        pins.i2cWriteBuffer(XRBIT_ADDRESS,buf23);
    }
    //% blockId=XRBIT_SaveServoAngle block="SaveServoAngle"
    //% weight=94
    //% blockGap=10
    //% color="#0fbc11"
    export function SaveServoAngle(): void {
        let buf14 = pins.createBuffer(2);
        let buf24 = pins.createBuffer(2);
        buf14[0] = 0xFF;
        buf14[1] = 0x11;
        buf24[0] = 0x01;
        buf24[1] = 0xFF;
        pins.i2cWriteBuffer(XRBIT_ADDRESS,buf14);
        pins.i2cWriteBuffer(XRBIT_ADDRESS,buf24);
    }

    //% blockId=XRit_RGB_Car_Program block="RGB_Car_Program"
    //% weight=99
    //% blockGap=10
    //% color="#0fbc11"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function RGB_Car_Program(): neopixel.Strip {
         
        if (!xrStrip) {
            xrStrip = neopixel.create(DigitalPin.P16, 4, NeoPixelMode.RGB);
        }
        return xrStrip;
    }

    //% blockId=irremote_on_pressed block = "irremote_on_pressed on |%IRValue| button pressed"
    //% color="#0fbc11"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function irremote_on_pressed(IRValue:IRValue): boolean {
        let irread: boolean = false;
        let IRreaddat = 0x00;
        let reg = pins.createBuffer(1);
        reg[0] = 0x16;
        pins.i2cWriteBuffer(XRBIT_ADDRESS, reg);
        IRreaddat = pins.i2cReadNumber(XRBIT_ADDRESS, NumberFormat.UInt8BE);
        if (IRreaddat == IRValue) {
            irread = true;
        }
        else { 
            irread = false;
        }
        return irread;
    }
}
radio.setGroup(1)
basic.showString("GO")
basic.forever(function () {
    if (XRBIT.irremote_on_pressed(XRBIT.IRValue.Num0)) {
        basic.showNumber(0)
    }
    if (XRBIT.irremote_on_pressed(XRBIT.IRValue.Num1)) {
        basic.showNumber(1)
    }
    if (XRBIT.irremote_on_pressed(XRBIT.IRValue.Num2)) {
        basic.showNumber(2)
    }
    if (XRBIT.irremote_on_pressed(XRBIT.IRValue.Play)) {
        basic.showString("P")
    }
})
