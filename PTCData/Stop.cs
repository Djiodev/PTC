using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PTCData
{
    public class Stop
    {
        public int ID { get; set; }
        public string Location { get; set; }
        public DateTime Arrival { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
