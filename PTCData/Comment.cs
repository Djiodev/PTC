using System;
using System.ComponentModel.DataAnnotations;

namespace PTCData
{
    public class Comment
    {
        public int ID { get; set; }
        public string Body { get; set; }
        public DateTime Created { get; set; }
        public string Username { get; set; }
        [Required]
        public int TripID { get; set; }
    }
}
