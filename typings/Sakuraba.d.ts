declare namespace Sakuraba {
    interface Board {
        distance: number;
        dust: number;

        actionLog: LogRecord[];
        chatLog: LogRecord[];

        p1Side: BoardSide;
        p2Side: BoardSide;
    }

    interface BoardSide {
        playerName; string;

        aura: number;
        life: number;
        flair: number;

        vigor: number;

        library: Card[];
        hands: Card[];
        used: Card[];
        hiddenUsed: Card[];
    }

    interface LogRecord {
        text: string;
        created: Date;
    }

    interface Card {
        id: string;
        sakuraToken?: number;
    }

    interface SpecialCard extends Card {
        used: boolean;
    }
}