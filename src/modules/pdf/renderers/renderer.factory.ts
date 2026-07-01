import { ATSClassicRenderer } from "./ats-classic.renderer";
import { ModernRenderer } from "./modern.renderer";
import { ProfessionalRenderer } from "./professional.renderer";
import { AccessibleRenderer } from "./accessible.renderer";
import { CreativeRenderer } from "./creative.renderer";
import { TechnicalRenderer } from "./technical.renderer";
import { HeaderBandRenderer } from "./header-band.renderer";
import { InspiredRenderer } from "./inspired.renderer";
import { SidebarLeftRenderer } from "./sidebar-left.renderer";
import { SidebarRightRenderer } from "./sidebar-right.renderer";
import { StraightforwardRenderer } from "./straightforward.renderer";
import { PlainRenderer } from "./plain.renderer";
import { VersatileRenderer } from "./versatile.renderer";
import { ResumeRenderer } from "./renderer.interface";

export class RendererFactory {
    static create(template: string): ResumeRenderer {
        switch (template) {
            case "ats-classic":
                return new ATSClassicRenderer();
            case "modern":
                return new ModernRenderer();
            case "professional":
                return new ProfessionalRenderer();
            case "accessible":
                return new AccessibleRenderer();
            case "creative":
                return new CreativeRenderer();
            case "technical":
                return new TechnicalRenderer();
            case "header-band":
                return new HeaderBandRenderer();
            case "inspired":
                return new InspiredRenderer();
            case "sidebar-left":
                return new SidebarLeftRenderer();
            case "sidebar-right":
                return new SidebarRightRenderer();
            case "straightforward":
                return new StraightforwardRenderer();
            case "plain":
                return new PlainRenderer();
            case "versatile":
                return new VersatileRenderer();
            default:
                return new ATSClassicRenderer();
        }
    }
}