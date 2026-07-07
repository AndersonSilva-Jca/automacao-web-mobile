import datetime
import random

def obter_dia_aleatorio_volta():
    hoje = datetime.date.today() # pega a data atual de hj
    dias_futuros = random.randint(3, 5)  
    data_futura = hoje + datetime.timedelta(days=dias_futuros) # calcula uma nova data futura
    return str(data_futura.day), str(data_futura.month), str(data_futura.year) # retorna o dia, mês e ano como texto
