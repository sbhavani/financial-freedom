export interface Institution {
    id: number;
    name: string;
}

export interface Account {
    id: number;
    name: string;
    description?: string;
    institution?: Institution;
    type: string;
    balance?: number;
    interest_rate?: number;
    import_map?: any;
    created_at?: string;
    updated_at?: string;
}

export interface CashAccount extends Account {
    account_number?: string;
    // balance is primarily used for cash accounts
}

export interface CreditCard extends Account {
    brand?: string;
    credit_limit?: number;
    // balance represents current debt
}

export interface Loan extends Account {
    original_balance?: number;
    remaining_balance?: number;
    payment_amount?: number;
    opened_at?: string;
    // remaining_balance is the primary "balance" for loans
}

export interface AccountsData {
    cashAccounts: CashAccount[];
    creditCards: CreditCard[];
    loans: Loan[];
    institutions: Institution[];
}
