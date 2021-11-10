import { Page } from "@playwright/test";
import {
  deviceInfo155 as deviceInfo,
  mockListAppsResult,
} from "@ledgerhq/live-common/lib/apps/mock";

export class DeviceAction {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openApp() {
    await this.page.evaluate(() => {
      (window as any).mock.events.mockDeviceEvent({ type: "opened" });
    });

    await this.page.waitForSelector("#deviceAction-loading", { state: "visible" });
  }

  async genuineCheck(appDesc: string = "Bitcoin", installedDesc: string = "Bitcoin") {
    const result = mockListAppsResult(appDesc, installedDesc, deviceInfo);

    await this.page.evaluate(
      args => {
        const [deviceInfo, result] = args;

        (window as any).mock.events.mockDeviceEvent(
          {
            type: "listingApps",
            deviceInfo,
          },
          {
            type: "result",
            result,
          },
          { type: "complete" },
        );
      },
      [deviceInfo, result],
    );

    await this.page.waitForSelector("#deviceAction-loading", { state: "hidden" });
  }

  async accessManager(
    appDesc: string = "Bitcoin,Tron,Litecoin,Ethereum,Ripple,Stellar",
    installedDesc: string = "Bitcoin,Litecoin,Ethereum (outdated)",
  ) {
    const result = mockListAppsResult(appDesc, installedDesc, deviceInfo);

    await this.page.evaluate(
      args => {
        const [deviceInfo, result] = args;

        (window as any).mock.events.mockDeviceEvent(
          {
            type: "listingApps",
            deviceInfo,
          },
          {
            type: "result",
            result,
          },
          { type: "complete" },
        );
      },
      [deviceInfo, result],
    );

    await this.page.waitForSelector("#deviceAction-loading", { state: "hidden" });
  }
}
