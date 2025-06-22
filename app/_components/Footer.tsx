import styles from "./footerStyles.module.css";

export { Footer };

function Footer() {
  return (
    <>
      <div className="columns is-justify-content-center" style={{backgroundColor: '#2f2f2f', paddingTop: '50px',  paddingBottom: '50px'}}>
        <div className="column is-8">
          <div className="columns">
            <div className="column is-narrow">
              <div className="" style={{ width: "240px" }}>
                <p className="title is-4 has-text-white">MONTHS</p>
                <aside className={`menu ${styles["month-list"]}`}>
                  <p className={`menu-label title is-5 ${styles["year-label"]}`}>2025</p>
                  <ul className="menu-list">
                    <li className={`title is-5 ${styles["month-label"]}`}><a>March (2)</a></li>
                    <li className={`title is-5 ${styles["month-label"]}`}><a>February (1)</a></li>
                  </ul>
                  <p className={`menu-label title is-5 ${styles["year-label"]}`}>2024</p>
                  <ul className="menu-list">
                    <li className={`title is-5 ${styles["month-label"]}`}><a>August (2)</a></li>
                    <li className={`title is-5 ${styles["month-label"]}`}><a>July (3)</a></li>
                    <li className={`title is-5 ${styles["month-label"]}`}><a>June (4)</a></li>
                    <li className={`title is-5 ${styles["month-label"]}`}><a>May (6)</a></li>
                  </ul>
                  <p className={`menu-label title is-5 ${styles["year-label"]}`}>2023</p>
                  <ul className="menu-list">
                    <li className={`title is-5 ${styles["month-label"]}`}><a>March (11)</a></li>
                    <li className={`title is-5 ${styles["month-label"]}`}><a>February (45)</a></li>
                    <li className={`title is-5 ${styles["month-label"]}`}><a>January (17)</a></li>
                  </ul>
                </aside>
              </div>
            </div>
            <div className="column">
              <div className="">
                <p className="title is-5 has-text-white">TAGS</p>
                <p className={`subtitle ${styles["tag-list"]}`}>
                  <a href="/blogs/tag/alerts">Alerts</a>
                  <a href="/blogs/tag/angular">Angular</a>
                  <a href="/blogs/tag/angular-10">Angular 10</a>
                  <a href="/blogs/tag/angular-11">Angular 11</a>
                  <a href="/blogs/tag/angular-14">Angular 14</a>
                  <a href="/blogs/tag/angular-15">Angular 15</a>
                  <a href="/blogs/tag/angular-16">Angular 16</a>
                  <a href="/blogs/tag/angular-2">Angular 2</a>
                  <a href="/blogs/tag/angular-4">Angular 4</a>
                  <a href="/blogs/tag/angular-5">Angular 5</a>
                  <a href="/blogs/tag/angular-6">Angular 6</a>
                  <a href="/blogs/tag/angular-7">Angular 7</a>
                  <a href="/blogs/tag/angular-8">Angular 8</a>
                  <a href="/blogs/tag/angular-9">Angular 9</a>
                  <a href="/blogs/tag/angular-directive">Angular Directive</a>
                  <a href="/blogs/tag/angular-ui-router">Angular UI Router</a>
                  <a href="/blogs/tag/angularjs">AngularJS</a>
                  <a href="/blogs/tag/animation">Animation</a>
                  <a href="/blogs/tag/aspnet">ASP.NET</a>
                  <a href="/blogs/tag/aspnet-core">ASP.NET Core</a>
                  <a href="/blogs/tag/aspnet-web-api">ASP.NET Web API</a>
                  <a href="/blogs/tag/authentication-and-authorization">Authentication and Authorization</a>
                  <a href="/blogs/tag/aws">AWS</a>
                  <a href="/blogs/tag/axios">Axios</a>
                  <a href="/blogs/tag/azure">Azure</a>
                  <a href="/blogs/tag/basic-authentication">Basic Authentication</a>
                  <a href="/blogs/tag/blazor">Blazor</a>
                  <a href="/blogs/tag/bootstrap">Bootstrap</a>
                  <a href="/blogs/tag/c">C#</a>
                  <a href="/blogs/tag/chai">Chai</a>
                  <a href="/blogs/tag/chrome">Chrome</a>
                  <a href="/blogs/tag/ckeditor">CKEditor</a>
                  <a href="/blogs/tag/css3">CSS3</a>
                  <a href="/blogs/tag/dapper">Dapper</a>
                  <a href="/blogs/tag/ddd">DDD</a>
                  <a href="/blogs/tag/deployment">Deployment</a>
                  <a href="/blogs/tag/design-patterns">Design Patterns</a>
                  <a href="/blogs/tag/docker">Docker</a>
                  <a href="/blogs/tag/dynamic-linq">Dynamic LINQ</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            <strong>NextJS-MyBlog</strong> by <a href="https://jgthms.com">Dabeng</a>.
          </p>
          <p>
            The source code is licensed <a href="https://opensource.org/license/mit">MIT</a>.
          </p>
        </div>
      </footer>
    </>
  );
}