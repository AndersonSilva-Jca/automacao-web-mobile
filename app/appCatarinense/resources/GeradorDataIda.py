# import datetime
# import random

# def obter_dia_aleatorio_ida():
#     DIAS_SEMANA = {
#         0: "SEGUNDA",
#         1: "TERÇA",
#         2: "QUARTA",
#         3: "QUINTA",
#         4: "SEXTA",
#         5: "SÁBADO",
#         6: "DOMINGO"
#     }

#     MESES = {
#         1: "JANEIRO", 2: "FEVEREIRO", 3: "MARÇO",
#         4: "ABRIL",   5: "MAIO",      6: "JUNHO",
#         7: "JULHO",   8: "AGOSTO",    9: "SETEMBRO",
#         10: "OUTUBRO", 11: "NOVEMBRO", 12: "DEZEMBRO"
#     }

#     hoje = datetime.date.today()
#     dias_futuros = random.randint(1, 3)
#     data_futura = hoje + datetime.timedelta(days=dias_futuros)

#     dia_semana = DIAS_SEMANA[data_futura.weekday()]
#     dia        = str(data_futura.day)
#     mes        = MESES[data_futura.month]
#     ano        = str(data_futura.year)

#     content_desc = f" {dia_semana} {dia} {mes} {ano} "

#     return dia, mes, ano, content_desc


import datetime
import random

def obter_dia_aleatorio_ida():
    hoje = datetime.date.today()
    dias_futuros = random.randint(2, 4)
    data_futura = hoje + datetime.timedelta(days=dias_futuros)

    data_formatada = data_futura.strftime("%d/%m/%Y")  # → "02/06/2026"

    return data_formatada