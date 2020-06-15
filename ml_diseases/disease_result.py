import pickle, os, sys, json, subprocess

path = os.path.dirname(os.path.abspath(__file__))
os.chdir(path)

disease_var = json.loads(sys.argv[1])
disease_flag = json.loads(sys.argv[2])
# load ml model

diseases_file = ['final_b_hepatitis.sav', 'final_c_hepatitis.sav', 'final_cirrhosis.sav', 'final_diabetes.sav',
                'final_Lung_cancer.sav', 'final_Myocardial_infarction.sav', 'final_stomach_cancer.sav', 'final_stroke.sav']
disease_dict={}

if(disease_flag['b_hepatitis']==1):
    a = open(diseases_file[0], 'rb')
    loaded_model = pickle.load(a)
    #loaded_model = pickle.load(open(diseases_file[0], 'rb'))
    result = loaded_model.predict_proba([[disease_var['age'],disease_var['gender'],disease_var['D_1_1'],disease_var['BO1_1'], disease_var['BS3_1'],disease_var['BS3_2'],disease_var['BH2_61'],disease_var['BE5_1'],disease_var['BD2_1'],disease_var['HE_fh'],disease_var['HE_HBfh'],disease_var['DI1_dg'],disease_var['DI1_2'],disease_var['DI4_dg'],disease_var['DK9_dg'],disease_var['DK4_dg'],disease_var['EC_wht_23'],disease_var['Total_slp_wk'],disease_var['Total_slp_wd'],disease_var['BP1'],disease_var['BE3_33'],disease_var['bmi']]])
    disease_dict['b_hepatitis'] = result[0][1]

if(disease_flag['c_hepatitis']==1):
    #c형간염
    loaded_model = pickle.load(open(diseases_file[1], 'rb'))
    result = loaded_model.predict_proba([[disease_var['age'],disease_var['gender'],disease_var['D_1_1'],disease_var['BO1_1'], disease_var['BS3_1'],disease_var['BS3_2'],disease_var['BH2_61'],disease_var['BE5_1'],disease_var['BD2_1'],disease_var['HE_fh'],
                                        disease_var['HE_HBfh'],disease_var['DI1_dg'],disease_var['DI1_2'],disease_var['DI4_dg'],disease_var['DK8_dg'],disease_var['DK4_dg'],disease_var['EC_wht_23'],disease_var['Total_slp_wk'],disease_var['Total_slp_wd'],disease_var['BP1'],disease_var['BE3_33'],disease_var['bmi']]])
    disease_dict['c_hepatitis'] = result[0][1]

if(disease_flag['cirrhosis']==1):
    #간경변증
    loaded_model = pickle.load(open(diseases_file[2], 'rb'))
    result = loaded_model.predict_proba([[disease_var['age'],disease_var['D_1_1'],disease_var['BO1_1'], disease_var['BS3_1'],disease_var['BH2_61'],disease_var['BE5_1'],disease_var['BD2_1'],disease_var['HE_fh'],
                                        disease_var['HE_HPfh'],disease_var['HE_HLfh'],disease_var['HE_STRfh'],disease_var['HE_HBfh'],disease_var['DI1_dg'],disease_var['DI1_2'],disease_var['DI2_dg'],disease_var['DI2_2'],disease_var['DK8_dg'],disease_var['DK9_dg'], disease_var['EC_wht_23'],disease_var['Total_slp_wk'],disease_var['Total_slp_wd'],disease_var['BP1'],disease_var['BE3_33'],disease_var['bmi']]])
    disease_dict['cirrhosis'] = result[0][1]

if(disease_flag['diabetes']==1):
    #당뇨
    loaded_model = pickle.load(open(diseases_file[3], 'rb'))
    result = loaded_model.predict_proba([[disease_var['age'],disease_var['gender'],disease_var['D_1_1'],disease_var['BO1_1'], disease_var['BS3_1'],disease_var['BS3_2'],disease_var['BH2_61'],disease_var['BE5_1'],disease_var['BD2_1'],disease_var['HE_fh'],
                                        disease_var['HE_HPfh'],disease_var['HE_HLfh'],disease_var['HE_IHDfh'],disease_var['HE_DMfh'],disease_var['DI1_dg'],disease_var['DI1_2'],disease_var['DI2_dg'],disease_var['DI2_2'],disease_var['DE1_dg'],disease_var['DE1_32'], disease_var['EC_wht_23'],disease_var['Total_slp_wk'],disease_var['Total_slp_wd'],disease_var['BP1'],disease_var['BE3_33'],disease_var['bmi']]])
    disease_dict['diabetes'] = result[0][1]

if(disease_flag['Lung_cancer']==1):
    #폐암
    loaded_model = pickle.load(open(diseases_file[4], 'rb'))
    result = loaded_model.predict_proba([[disease_var['age'],disease_var['gender'],disease_var['D_1_1'],disease_var['BO1_1'], disease_var['BS3_1'],disease_var['BS3_2'],disease_var['HE_sput2'],disease_var['BH2_61'],disease_var['BE5_1'],disease_var['BD2_1'],disease_var['HE_fh'],
                                        disease_var['DI4_dg'],disease_var['DJ2_dg'],disease_var['DC1_dg'],disease_var['DC2_dg'],disease_var['DK4_dg'], disease_var['EC_wht_23'],disease_var['Total_slp_wk'],disease_var['Total_slp_wd'],disease_var['BP1'],disease_var['BE3_33'],disease_var['bmi']]])
    disease_dict['Lung_cancer'] = result[0][1]

if(disease_flag['Myocardial_infarction']==1):
    #심근경색
    loaded_model = pickle.load(open(diseases_file[5], 'rb'))
    result = loaded_model.predict_proba([[disease_var['age'],disease_var['D_1_1'], disease_var['BS3_1'],disease_var['BH2_61'],disease_var['BE5_1'],disease_var['BD2_1'],disease_var['HE_fh'],
                                        disease_var['HE_HPfh'],disease_var['HE_DMfh'],disease_var['HE_IHDfh'],disease_var['DE1_dg'],disease_var['DI1_dg'],disease_var['DC1_dg'],disease_var['DC2_dg'],disease_var['DC6_dg'],
                                        disease_var['DK8_dg'], disease_var['DK9_dg'],disease_var['DK4_dg'],disease_var['Total_slp_wk'],disease_var['Total_slp_wd'],disease_var['BP1'],disease_var['BE3_33'],disease_var['bmi']]])
    disease_dict['Myocardial_infarction'] = result[0][1]

if(disease_flag['stomach_cancer']==1):
    #위암
    loaded_model = pickle.load(open(diseases_file[6], 'rb'))
    result = loaded_model.predict_proba([[disease_var['age'],disease_var['D_1_1'],disease_var['BH2_61'],disease_var['BE5_1'],disease_var['BD2_1'],disease_var['HE_fh'],disease_var['DI3_dg'],disease_var['DI4_dg'],
                                        disease_var['DJ2_dg'],disease_var['DC2_dg'],disease_var['DK4_dg'],disease_var['EC_wht_23'],disease_var['Total_slp_wk'],disease_var['Total_slp_wd'],disease_var['BP1'],disease_var['BE3_33'],disease_var['bmi']]])
    disease_dict['stomach_cancer'] = result[0][1]

if(disease_flag['stroke']==1):
    #뇌졸중
    loaded_model = pickle.load(open(diseases_file[7], 'rb'))
    result = loaded_model.predict_proba([[disease_var['age'],disease_var['D_1_1'],disease_var['BO1_1'], disease_var['BS3_1'],disease_var['BS3_2'],disease_var['BH2_61'],disease_var['BE5_1'],disease_var['BD2_1'],disease_var['HE_fh'],
                                        disease_var['HE_HPfh'],disease_var['HE_HLfh'],disease_var['HE_IHDfh'],disease_var['HE_STRfh'],disease_var['HE_DMfh'],disease_var['DI1_dg'],disease_var['DI1_2'],disease_var['DI2_dg'],disease_var['DI2_2'],disease_var['DI4_dg'],disease_var['DE1_dg'],
                                        disease_var['DE1_32'], disease_var['EC_wht_23'],disease_var['Total_slp_wk'],disease_var['Total_slp_wd'],disease_var['BP1'],disease_var['BE3_33'],disease_var['bmi']]])
    disease_dict['stroke'] = result[0][1]



#return data to nodejs
json_dict = json.dumps(disease_dict)
print(json_dict)