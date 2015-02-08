using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using GCAPI.Models;

namespace GCAPI.Controllers
{
    public class ScorecardController : Controller
    {
        private golfchallengeEntities db = new golfchallengeEntities();

        // GET: /Scorecard/
        public ActionResult Index()
        {
            var scorecards = db.Scorecards.Include(s => s.Match).Include(s => s.Player);
            return View(scorecards.ToList());
        }

        // GET: /Scorecard/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Scorecard scorecard = db.Scorecards.Find(id);
            if (scorecard == null)
            {
                return HttpNotFound();
            }
            return View(scorecard);
        }

        // GET: /Scorecard/Create
        public ActionResult Create()
        {
            //ViewBag.MatchId = new SelectList(db.Matches, "Id", "Description");
            ViewBag.PlayerId = new SelectList(db.Players, "Id", "Name");
            return View();
        }

        // POST: /Scorecard/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        //[HttpPost]
        ////[ValidateAntiForgeryToken]
        //public ActionResult Create([Bind(Include="Id,PlayerId,Score")] Scorecard scorecard)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        int matchId = Convert.ToInt32(Request.QueryString["matchId"]);
        //        scorecard.MatchId = matchId;
        //        db.Scorecards.Add(scorecard);
        //        db.SaveChanges();
        //        Response.Redirect("/Match/Details/" + matchId);
        //    }

        //    ViewBag.MatchId = new SelectList(db.Matches, "Id", "Description", scorecard.MatchId);
        //    ViewBag.PlayerId = new SelectList(db.Players, "Id", "Name", scorecard.PlayerId);
        //    return View(scorecard);
        //}

        [HttpPost]
        public string Create(int MatchId, int PlayerId, int Score)
        {
            try
            {
                Scorecard scorecard = new Scorecard();
                scorecard.MatchId = MatchId;
                scorecard.PlayerId = PlayerId;
                scorecard.Score = String.IsNullOrEmpty(Score.ToString()) ? Score : 0;
                db.Scorecards.Add(scorecard);
                db.SaveChanges();
                return MatchId.ToString();
            }
            catch (Exception ex)
            {
                return "Error";
            }
            return "wat";
        }

        // GET: /Scorecard/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Scorecard scorecard = db.Scorecards.Find(id);
            if (scorecard == null)
            {
                return HttpNotFound();
            }
            ViewBag.MatchId = new SelectList(db.Matches, "Id", "Description", scorecard.MatchId);
            ViewBag.PlayerId = new SelectList(db.Players, "Id", "Name", scorecard.PlayerId);
            return View(scorecard);
        }

        // POST: /Scorecard/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include="Id,PlayerId,MatchId")] Scorecard scorecard)
        {
            if (ModelState.IsValid)
            {
                db.Entry(scorecard).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.MatchId = new SelectList(db.Matches, "Id", "Description", scorecard.MatchId);
            ViewBag.PlayerId = new SelectList(db.Players, "Id", "Name", scorecard.PlayerId);
            return View(scorecard);
        }

        // GET: /Scorecard/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Scorecard scorecard = db.Scorecards.Find(id);
            if (scorecard == null)
            {
                return HttpNotFound();
            }
            return View(scorecard);
        }

        // POST: /Scorecard/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Scorecard scorecard = db.Scorecards.Find(id);
            db.Scorecards.Remove(scorecard);
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
