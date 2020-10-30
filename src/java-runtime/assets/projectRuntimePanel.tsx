import * as _ from "lodash";
import * as path from "path";
import * as React from "react";
import { JavaRuntimeEntry, JDKEntry, ProjectRuntimeEntry } from "../types";
import { InvisibleProjectsRuntimePanel } from "./sourcelevel.invisible";
import { SourceLevelRuntimePanel } from "./sourcelevel.managed";

export const ProjectRuntimePanel = (props: {
  jdkEntries: JavaRuntimeEntry[];
  projectRuntimes: ProjectRuntimeEntry[];
}) => {
  const { jdkEntries, projectRuntimes } = props;
  console.log(props);

  let sourceLevelRuntimePanels;
  let invisibleProjectsRuntimePanel;
  if (projectRuntimes && jdkEntries) {
    const sourceLevelEntries = _.uniqBy(projectRuntimes.map(p => ({ sourceLevel: p.sourceLevel, runtimePath: p.runtimePath })), "sourceLevel");
    const jdks: JDKEntry[] = jdkEntries.map(e => ({
      name: e.path,
      fspath: e.path,
      majorVersion: e.version,
      version: e.version.toString()
    }));

    const invisibleProject = projectRuntimes.find(p => p.rootPath.endsWith("jdt.ls-java-project") || p.rootPath.endsWith("jdt.ls-java-project/"));
    const defaultJDK = invisibleProject ? invisibleProject.runtimePath : undefined;

    sourceLevelRuntimePanels = sourceLevelEntries.map(entry => (<SourceLevelRuntimePanel entry={entry} jdks={jdks} key={entry.sourceLevel} />));
    invisibleProjectsRuntimePanel = (<InvisibleProjectsRuntimePanel jdks={jdks} defaultJDK={defaultJDK} />);
  } else {
    // loading
    sourceLevelRuntimePanels = invisibleProjectsRuntimePanel = (
      <div className="spinner-border spinner-border-sm" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="col">
      <div className="row mb-3">
        <div className="col-6">
          <h3 className="font-weight-light">Maven/Gradle Projects</h3>
          <p>Java version is managed by build tools. Java versions detected in your projects are listed below, you can select corresponding JDK for each version.</p>
          {sourceLevelRuntimePanels}
          <p>
            To use a different Java version for your projects, please specify it in build scripts. For example, if you want to use Java 8, add below lines
          </p>
          <p>In <code>pom.xml</code> of a Maven project:</p>
          <blockquote>
            <code>
              <span>&lt;properties&gt;</span><br />
              <span>&nbsp;&nbsp;&lt;maven.compiler.source&gt;1.8&lt;/maven.compiler.source&gt;</span><br />
              <span>&nbsp;&nbsp;&lt;maven.compiler.target&gt;1.8&lt;/maven.compiler.target&gt;</span><br />
              <span>&lt;/properties&gt;</span>
            </code>
          </blockquote>

          <p>In <code>build.gradle</code> of a Gradle project:</p>
          <blockquote>
            <code>
              <span>sourceCompatibility = 1.8</span><br />
              <span>targetCompatibility = 1.8</span><br />
            </code>
          </blockquote>
        </div>

        <div className="col-6">
          <h3 className="font-weight-light">Folders without build tools</h3>
          <p>
            For folders containing .java files, but not managed by build tools like Maven/Gradle, a default JDK is used.
          </p>
          {invisibleProjectsRuntimePanel}
        </div>
      </div>
    </div>
  );
};
