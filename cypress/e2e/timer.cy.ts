describe("뽀모도로 타이머 메인 화면", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("시작 버튼을 누르면 시간이 줄어들어야 한다.", () => {
    cy.getByCy("time-display")
      .invoke("text")
      .then((initialText: string) => {
        const [initMinute, initSecond] = initialText.split(":");
        const initialTime = Number(initMinute) * 60 + Number(initSecond); // 숫자로 변환

        cy.getByCy("start-button").click(); // 시작 버튼 클릭
        cy.wait(2000); // 2초 지남

        cy.getByCy("time-display")
          .invoke("text")
          .then((updatedText) => {
            const [updatedMinute, updatedSecond] = updatedText.split(":");
            const updatedTime =
              Number(updatedMinute) * 60 + Number(updatedSecond); // 숫자로 변환

            expect(updatedTime).to.be.lessThan(initialTime); // 시간이 줄어들었는지 확인
            expect(updatedTime).to.be.equal(initialTime - 2);
          });
      });
  });

  it("일시 정지 버튼을 누르면 시간이 유지되어야 한다.", () => {
    cy.getByCy("start-button").click();
    cy.wait(2000); // 2초 후
    cy.getByCy("pause-button").click(); // 타이머 일시 정지

    cy.getByCy("time-display")
      .invoke("text")
      .then((pausedTime) => {
        cy.wait(2000); // 2초 기다림
        cy.getByCy("time-display").should("have.text", pausedTime); // 시간이 그대로여야 함
      });
  });

  it("타이머가 0이 되면 자동으로 다음 모드로 전환되어야 한다.", () => {
    // 시작 버튼을 클릭하여 타이머 시작
    cy.clock(); // 시간을 고정시킴
    cy.getByCy("start-button").click();

    // 타이머가 작동 중일 때, 원하는 시간만큼 빠르게 돌림 (여기서는 25분을 1초에 해당하는 값만큼 진행)
    cy.tick(25 * 60 * 1000); // 25분을 밀리초로 변환하여 시간을 빠르게 돌림

    cy.getByCy("mode-display")
      .invoke("text")
      .should((mode) => {
        expect(mode.toLowerCase()).not.to.include("work"); // 다음 모드로 바뀌었는지 확인
      });

    cy.tick(5 * 60 * 1000);

    cy.getByCy("mode-display")
      .invoke("text")
      .should((mode) => {
        expect(mode.toLowerCase()).to.include("work"); // 다음 모드로 바뀌었는지 확인
      });

    cy.tick(5 * 60 * 1000);
  });

  it("리셋 버튼을 누르면 시간이 초기화되어야 한다.", async () => {
    const { formatSecond } = await import("../../src/utils/date"); // 동적 import

    cy.getByCy("start-button").click();
    cy.wait(2000);
    cy.getByCy("reset-button").click();
    cy.getByCy("time-display").should("have.text", formatSecond(25 * 60));
  });

  it("스킵 버튼을 누르면 모드가 바뀌어야한다.", () => {
    cy.getByCy("start-button").click();
    cy.wait(2000);
    cy.getByCy("skip-button").click();
    cy.getByCy("mode-display")
      .invoke("text")
      .should((mode) => {
        expect(mode.toLowerCase()).not.to.include("work"); // 다음 모드로 바뀌었는지 확인
      });
  });
});
