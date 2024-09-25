﻿namespace FU.OJ.Server.Infra.Const.Route
{
    public class BlogRoute
    {
        public const string INDEX = "blogs";
        public static class Action
        {
            public const string Create = "create";
            public const string GetAll = "get";
            public const string GetDetails = "get/{id}";
            public const string Update = "update";
            public const string Delete = "Delete";
        }
    }
}