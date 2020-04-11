using System;
using System.Collections.Generic;
using System.IO.Ports;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ThermalCam
{
    class Program
    {
        static void Main(string[] args)
        {
            SerialPort mySerialPort = new SerialPort("COM8");

            mySerialPort.BaudRate = 115200;
            mySerialPort.Parity = Parity.None;
            mySerialPort.StopBits = StopBits.One;
            mySerialPort.DataBits = 8;
            mySerialPort.Handshake = Handshake.None;

            mySerialPort.DataReceived += new SerialDataReceivedEventHandler(DataReceivedHandler);

            mySerialPort.Open();

            Console.WriteLine("Press any key to continue...");
            Console.WriteLine();
            Console.ReadKey();
            mySerialPort.Close();
        }
         

        private static void DataReceivedHandler(object sender, SerialDataReceivedEventArgs e)
        {
            SerialPort sp = (SerialPort)sender;

            string dateNow = DateTime.Now.ToString("dd-MM-yyyy HH:mm:ss");

            string indata = dateNow +" "+ sp.ReadExisting();
            Console.Write(indata);

            using (System.IO.StreamWriter sw = System.IO.File.AppendText(@"D:\sandbox\ThermalCamArduino\thermal-nodeJS\views\logs\eboard.csv"))
            {
                sw.WriteLine(indata) ;
            }

            using (System.IO.StreamWriter sw = System.IO.File.CreateText(@"D:\sandbox\ThermalCamArduino\thermal-nodeJS\views\logs\eboard_live.csv"))
            {
                sw.WriteLine(indata);
            }

        }



    }
}
