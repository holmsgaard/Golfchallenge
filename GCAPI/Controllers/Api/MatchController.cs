using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using GCAPI.Models;

namespace GCAPI.Controllers.Api
{
    public class MatchController : ApiController
    {
        private golfchallengeEntities db = new golfchallengeEntities();

        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public HttpResponseMessage Get(int id)
        {
            return Request.CreateResponse();
        }

        public string Wat()
        {
            return "Wat";
        }

        // POST api/<controller>
        //public HttpResponseMessage Post([Bind(Include="Id")] Match match)
        //{
        //    try
        //    {
        //        match = db.Matches.Add(match);
        //        db.SaveChanges();
        //        return Request.CreateResponse(HttpStatusCode.OK, match, "application/json");
        //    }
        //    catch (Exception ex)
        //    {

        //        return Request.CreateResponse(HttpStatusCode.InternalServerError, (object)null, "application/json");
        //    }
        //}

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}