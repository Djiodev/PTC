using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PTCData
{
    public class Trip
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public DateTime Departure { get; set; }
        public DateTime Created { get; set; }
        public List<Stop> Stops { get; set; }
        public List<Comment> Comments { get; set; }
        public int MyProperty { get; set; }
        public string Username { get; set; }
    }
}
