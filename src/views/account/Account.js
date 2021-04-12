import React, { Component } from 'react';
import axios from "axios";
import nextId from "react-id-generator";
import {
    CBadge,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CButton,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CRow,
    CSelect,
    CInput,
    CLabel,
    CContainer,
    CHeader
} from '@coreui/react'
const getBadge = status => {
    switch (status) {
        case 'Active': return 'success'
        case 'Inactive': return 'secondary'
        case 'Pending': return 'warning'
        case 'Banned': return 'danger'
        default: return 'primary'
    }
}
class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taxcode: [],
            GLAc: [],
            Supplier: [],
            taxRule: 'wt',///wot///
            taxTableRow: [
                {
                    id: nextId(),
                    amount: 0,
                    taxCode: '',
                }
            ]
        }
        this.addTransactionRow = this.addTransactionRow.bind(this);
        this.deleteTransactionRow = this.deleteTransactionRow.bind(this);
        this.taxCalculation = this.taxCalculation.bind(this);
        this.changeTaxRule = this.changeTaxRule.bind(this);
    }
    handleChange = (e, rowId) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let tableRows = this.state.taxTableRow;
        let findIndex = tableRows.findIndex((i) => i.id == rowId);
        if (findIndex >= 0) {
            let selectedRow = tableRows[findIndex];
            selectedRow[name] = value;
            tableRows[findIndex] = selectedRow;
        }
        this.setState({ tableRows: tableRows });
        this.taxCalculation(rowId);
    }
    changeTaxRule(e) {
        this.setState({ taxRule: e.target.value });
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.taxRule !== this.state.taxRule) {
            this.state.taxTableRow.forEach((each) => {
                this.taxCalculation(each.id);
            })
        }
    }
    taxCalculation(rowId) {
        let tableRows = this.state.taxTableRow;
        let findIndex = tableRows.findIndex((i) => i.id == rowId);
        if (findIndex >= 0) {
            let selectedRow = tableRows[findIndex];
            let currTax = this.state.taxcode.find((x) => x.Taxcode == selectedRow.taxCode);
            if (currTax) {
                console.log(currTax.CGSTperage, parseFloat(currTax.CGSTperage), "cbjhbkgh")
                let CESSperage = parseFloat(currTax.CESSperage);
                let CGSTperage = parseFloat(currTax.CGSTperage);
                let SGSTperage = parseFloat(currTax.SGSTperage);
                if (this.state.taxRule == 'wt')
                    selectedRow.taxBaseAmt = ((selectedRow.amount) / (1 + CESSperage / 100 + CGSTperage / 100 + SGSTperage / 100)).toFixed(2);
                else
                    selectedRow.taxBaseAmt = selectedRow.amount;
                selectedRow.cessAmt = (selectedRow.taxBaseAmt * (CESSperage / 100)).toFixed(2);
                selectedRow.cgstAmt = (selectedRow.taxBaseAmt * (CGSTperage / 100)).toFixed(2);
                selectedRow.sgstAmt = (selectedRow.taxBaseAmt * (SGSTperage / 100)).toFixed(2);
            }
            tableRows[findIndex] = selectedRow;
        }
        this.setState({ tableRows: tableRows });
    }
    addTransactionRow() {
        let newRowId = nextId();
        let row = {
            id: newRowId,
            amount: 0,
            taxCode: '',
        }
        let tableRow = this.state.taxTableRow;
        tableRow.push(row);
        this.setState({
            taxTableRow: tableRow
        });
    }
    deleteTransactionRow(id) {
        let tableRows = this.state.taxTableRow;
        let findIndex = tableRows.findIndex((item) => item.id == id);
        if (findIndex >= 0) {
            tableRows.splice(findIndex, 1);
        }
        this.setState({
            taxTableRow: tableRows
        });
    }
    componentDidMount() {
        this.fetchTaxCode();
        this.fetchGLAc();
        this.fetchSupplier();
    }


    async fetchTaxCode() {
        const content = {
            method: 'GET',
            url: `http://ohditaccounts.azurewebsites.net/get_All_taxdetails`,

        }
        await axios(content)
            .then(response => {
                console.log('TAX CODE Response', response.data)
                this.setState({ taxcode: response.data })
                console.log('state', this.state.taxcode)
            })
    }

    async fetchGLAc() {
        const content = {
            method: 'GET',
            url: `http://ohditaccounts.azurewebsites.net/get_Business_Partner`,

        }
        await axios(content)
            .then(response => {
                console.log('GL Response', response.data)
                this.setState({ GLAc: response.data })
                console.log('state', this.state.GLAc)
            })
    }
    async fetchSupplier() {
        const content = {
            method: 'GET',
            url: `http://ohditaccounts.azurewebsites.net/get_GlAccount_details`,

        }
        await axios(content)
            .then(response => {
                console.log('Supplier Response', response.data)
                this.setState({ Supplier: response.data })
                console.log('state', this.state.Supplier)
            })
    }

    render() {
        let amountTotal = 0;
        let cgstTotal = 0;
        let sgstTotal = 0;
        let cessTotal = 0;
        let taxBaseTotal = 0;
        let wholeTotal = 0;
        this.state.taxTableRow.forEach((eachItem) => {
            let amount = parseFloat(eachItem.amount || 0);
            let cgstAmt = parseFloat(eachItem.cgstAmt || 0);
            let sgstAmt = parseFloat(eachItem.sgstAmt || 0);
            let cessAmt = parseFloat(eachItem.cessAmt || 0);
            let taxBaseAmt = parseFloat(eachItem.taxBaseAmt || 0);
            amountTotal += amount;
            cgstTotal += cgstAmt;
            sgstTotal += sgstAmt;
            cessTotal += cessAmt;
            taxBaseTotal += taxBaseAmt;
            wholeTotal += cgstAmt + sgstAmt + cessAmt + taxBaseAmt;
        })
        amountTotal = amountTotal.toFixed(2);
        cgstTotal = cgstTotal.toFixed(2);
        sgstTotal = sgstTotal.toFixed(2);
        cessTotal = cessTotal.toFixed(2);
        taxBaseTotal = taxBaseTotal.toFixed(2);
        wholeTotal = wholeTotal.toFixed(2);
        return (
            <React.Fragment>
                <CCol xs="12" lg="12">
                    <CCard>
                        <CCardHeader>
                            Accounts Data
                            <div class="d-inline float-right" >
                                <div class="row mx-md-n5">
                                    <div class="col px-md">
                                        <CSelect id="tbtx"
                                            size='sm' value={this.state.taxRule} onChange={this.changeTaxRule}>
                                            <option value="wt" selected>Inclusive of tax</option>
                                            <option value="wot">Exclusive of tax</option>
                                        </CSelect></div>
                                    <div class="col px-md">
                                        <CButton
                                            color='primary'
                                            size='sm'
                                            onClick={this.addTransactionRow}
                                        >
                                            Add Row
                            </CButton></div>
                                </div>


                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <div class="container">
                                <CRow>
                                    <CCol >
                                        <CLabel>#</CLabel>
                                    </CCol>
                                    <CCol >
                                        GL Account
                                </CCol>
                                    <CCol >
                                        Description
                                </CCol>
                                    <CCol >
                                        Amount(INR)
                                </CCol>
                                    <CCol >
                                        TAX Code
                                </CCol>
                                    <CCol >
                                        CGST
                                </CCol>
                                    <CCol >
                                        SGST
                                </CCol>
                                    <CCol >
                                        CESS
                                </CCol>
                                    <CCol >
                                        Tax Base Amt
                                </CCol>
                                    <CCol >
                                        Action
                                </CCol>
                                </CRow>
                                {this.state.taxTableRow.map((item, index) => {
                                    return (
                                        <div class="pt-2">
                                            <CRow  >
                                                <CCol >
                                                    <CLabel>{++index}</CLabel>
                                                </CCol>
                                                <CCol >
                                                    <CSelect >
                                                        {this.state.Supplier.map((data) =>
                                                            <option value={data.Description}>{data.Description}</option>)
                                                        }
                                                    </CSelect>
                                                </CCol>
                                                <CCol >
                                                    <CInput id="description" />
                                                </CCol>
                                                <CCol >
                                                    <CInput name="amount" id="amount" value={item.amount} onChange={(e) => this.handleChange(e, item.id)} />

                                                </CCol>
                                                <CCol >
                                                    <CSelect name="taxCode" id="taxCode" value={item.taxCode} onChange={(e) => this.handleChange(e, item.id)}>
                                                        {this.state.taxcode.map((data) =>
                                                            <option style={{ color: "black" }} value={data.Taxcode}>{data.TaxDesc}</option>

                                                        )
                                                        }
                                                    </CSelect>
                                                </CCol>
                                                <CCol >
                                                    <CInput name="txtCGST" readOnly id="txtCGST" value={item.cgstAmt} />

                                                </CCol>
                                                <CCol >
                                                    <CInput name="txtSGST" readOnly id="txtSGST" value={item.sgstAmt} />

                                                </CCol>
                                                <CCol >
                                                    <CInput name="txtCESS" readOnly id="txtCESS" value={item.cgstAmt} />

                                                </CCol>
                                                <CCol >
                                                    <CInput name="txtBaseAmt" readOnly id="txtBaseAmt" value={item.taxBaseAmt} />

                                                </CCol>
                                                <CCol >
                                                    <CButton
                                                        key={item.id}
                                                        color='danger'
                                                        size='sm'
                                                        onClick={() => this.deleteTransactionRow(item.id)}
                                                    >
                                                        Delete
                                                </CButton>
                                                </CCol>
                                            </CRow>
                                        </div>)
                                })}
                                <div class="pt-2">
                                    <CRow>
                                        <CCol >
                                            <CLabel>Total</CLabel>
                                        </CCol>
                                        <CCol >

                                        </CCol>
                                        <CCol >

                                        </CCol>
                                        <CCol >
                                            {amountTotal}
                                        </CCol>
                                        <CCol >

                                        </CCol>
                                        <CCol >
                                            {cgstTotal}
                                        </CCol>
                                        <CCol >
                                            {sgstTotal}
                                        </CCol>
                                        <CCol >
                                            {cessTotal}
                                        </CCol>
                                        <CCol >
                                            {taxBaseTotal}
                                        </CCol>
                                        <CCol >

                                        </CCol>
                                    </CRow>
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </React.Fragment>

        );
    }
}

export default Account;