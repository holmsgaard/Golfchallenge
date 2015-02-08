using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;
using System.Net.Http.Formatting;
using GCAPI.Models;

namespace GCAPI.Controllers
{
    public class MatchController : Controller
    {
        private golfchallengeEntities db = new golfchallengeEntities();

        // GET: /Match/
        public ActionResult Index()
        {
            var viewModel = new LeaderboardData();
            

            viewModel.Matches = db.Matches.ToList();
            viewModel.Players = db.Players.ToList();

            var Result = from p in db.Players
                         select new LeaderboardPlayer { Id = p.Id, NickName = p.NickName, Scorecards = db.Scorecards.Where(s => s.PlayerId == p.Id) };

            //var Result2 = from sc in db.Scorecards
            //              join p in db.Players on sc.PlayerId equals p.Id
            //              select new LeaderboardPlayer { Id = p.Id, NickName = p.NickName};

            viewModel.LeaderboardPlayers = Result.ToList();
            




            return View(viewModel);
            //return View(db.Matches.ToList());
        }

        // Get list of matches
        public JsonResult GetMatches()
        {
            try {
                var data = from match in db.Matches
                           where match.CreateDate != null
                           select new Models.MatchData
                           {
                               Id = match.Id,
                               Description = match.Description,
                               CreateDate = match.CreateDate
                           };


                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /*
         * 
        [HttpGet]
        public JsonResult GetPlayers()
        {
            try {
                var data = from player in db.Players
                           select new Models.PlayerData
                           {
                               Id = player.Id,
                               NickName = player.NickName,
                               Name = player.Name
                           };

                return Json(data, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
         * */

        // GET: /Match/Details/5
        public ActionResult Details(int? id)
        {
            var viewModel = new MatchData();

            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }

            Match match = db.Matches.Find(id);
            if (match == null)
            {
                return HttpNotFound();
            }

            viewModel.Scorecards = db.Scorecards
                .Where(s => s.MatchId == match.Id)
                .OrderByDescending(s => s.Score);

            viewModel.Id = match.Id;
            viewModel.Description = match.Description;
            return View(viewModel);
        }

         //GET: /Match/Create
        public ActionResult Create()
        {
            return View();
        }

        

        // POST: /Match/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public string Create(string description)
        {
            try
            {
                Match match = new Match();
                match.Description = "1"; // Creater Id
                match.CreateDate = DateTime.Now;
                db.Matches.Add(match);
                db.SaveChanges();
                return match.Id.ToString();
            }
            catch (Exception ex) {
                return "Wat2";
            }
        }

        //[HttpPost]
        //public ActionResult Create([Bind(Include="Id")] Match match)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        db.Matches.Add(match);
        //        db.SaveChanges();
        //        Response.Redirect("/Match/Details/" + match.Id);
        //    }

        //    return View(match);
        //}

        // GET: /Match/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Match match = db.Matches.Find(id);
            if (match == null)
            {
                return HttpNotFound();
            }
            return View(match);
        }

        // POST: /Match/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include="Id,Description")] Match match)
        {
            if (ModelState.IsValid)
            {
                db.Entry(match).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(match);
        }

        // GET: /Match/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Match match = db.Matches.Find(id);
            if (match == null)
            {
                return HttpNotFound();
            }
            return View(match);
        }

        // POST: /Match/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Match match = db.Matches.Find(id);
            db.Matches.Remove(match);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
