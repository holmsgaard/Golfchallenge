using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System;

namespace GCAPI.Models
{
    public class MatchData
    {
        public IEnumerable<Scorecard> Scorecards { get; set; }
        public string Description { get; set; }
        public int Id { get; set; }
        public DateTime? CreateDate { get; set; }
        //[DisplayFormat(DataFormatString = "{0:yyyy/MM/dd}")]
        //[DataType(DataType.Date)]
        //public Nullable<DateTime> CreateDate { get; set; }
    }

    public class LeaderboardPlayer {
        public int Id { get; set; }
        public string NickName { get; set; }
        public int Strokes { get; set; }
        public int Points { get; set; }
        public IEnumerable<Scorecard> Scorecards { get; set; }
    }

    public class LeaderboardData
    {
        public IEnumerable<LeaderboardPlayer> LeaderboardPlayers { get; set; }
        public IEnumerable<Player> Players { get; set; }
        public IEnumerable<Match> Matches { get; set; }
    }
}