<div class="subline-date">3 Jan 2017 by Alon Bar David</div>
## Multiple sites with MVC 5!

### Summary
Sometimes you want to run multiple sites with slightly different content or presentation from the same ASP.net project.
There's no built in way in ASP.net or using ASP.net MVC to do so, but with a bit of setup and convention it's easy to accomplish.

Here's what you can do:

* Save the current site in the `HttpContext` using `Global.aspx requestStart/requestEnd`
* Use an interface to denote a Model displays differently on different sites
* Add extension method for site based queries
* Bundle different css and js based on site
* Set IIS to serve the same site for multiple domains


### Background

Recently I've been asked to merge two, basically identical sites that share the same database.
The sites showed different content from the same database based on a site id in the models.
Unlike other frameworks ASP.net doesn't have the concept of sites, but it was fairly easy to setup a few conventions for it to work.


### Recipe

#### Save the current site on requestStart

To match each request to a particular site, we need to keep track of the domain.  
The simplest way is to simply store the domain in the `HttpContext` for each request for easy access later.

```csharp
    //Global.asax
    protected void Application_BeginRequest(object sender, EventArgs e)
    {
        HttpContext.Current.Items["_site"] = ((ASP.global_asax) sender).Request.Url.Host;
    }
```


#### Use an interface to denote a Model displays differently on different sites

Once the `HttpContext` has a reference to the site, you can set your model to match a specific site.
For reuse and extension methods it's best to create an interface for it

```csharp
    public interface ISiteBased {
        public string site {get;set;}
    }

    public class MyModel:ISiteBased {
        ...
    }
```


#### Add extension method for site based queries

Now you can use an extension method to always use the right site

```csharp
    public static class SiteExtensions {
        public IQueryable<T> SiteOnly<T>(this IQueryable<T> query) where T : class,ISiteBased
        {
            var currentSite = (string) HttpContext.Current.Items["_site"];
            return query.where(s=>s.site == currentSite);
        }
    }
```

Or alternatively you can set it up in your `DBContext`

```csharp
    public class MyContext:DBContext {
        public IQueryable<T> SiteQuery<T>() where T : class,ISiteBased
        {
            var currentSite = (string) HttpContext.Current.Items["_site"];
            return Set<T>().where(s=>s.site == currentSite);
        }
    }
```

Just need to remember to use it whenever you want to show content per site


#### Bundle different css and js based on site

To support different styles and javascript for different site we need to do the following:

* put your css in a folder for each site inside a common directory such as `~/Sites/<site name>/`
* setup a bundle for each site based on some convention

```csharp
    // App_Start/BundleConfig.cs

    public class BundleConfig {
        public static void RegisterBundles(BundleCollection bundles){
            ...
            foreach(string site in ListOfSites)
            {
                bundles.Add(new StyleBundle($"~/content/css/{site}")
                    .IncludeDirectory($"~/Sites/" + site, "*.css", true));
            }
        }
    }
```

* use the appropriate bundle in your `_Layout.cshtml`

```html
    ...
    <head>
    ...
    @Styles.Render("~/content/css")
    @Styles.Render($"~/content/css/{Context.Items["_site"]})
    ...
```

* a similar setup can be used for javascript files (or any other files you want)


#### Set IIS to serve the same site for multiple domains

This will work in development (if you change `etc/hosts` file) but for production we need to allow multiple domains
to get to the same project.

To do that you need to go to `IIS manager` and add bindings to your site for each domain.