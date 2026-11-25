// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'figure.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendFigure _$FrontendFigureFromJson(Map<String, dynamic> json) => FrontendFigure(
  basis: $enumDecode(_$SharedFigureBasisEnumMap, json['basis']),
  decimals: (json['decimals'] as num?)?.toInt(),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  indicator: json['indicator'] as String,
  label: SharedLocalizedText.fromJson(json['label'] as Map<String, dynamic>),
  lower: (json['lower'] as num?)?.toDouble(),
  status: $enumDecode(_$SharedFigureStatusEnumMap, json['status']),
  toYear: (json['toYear'] as num?)?.toInt(),
  unit: json['unit'] as String?,
  upper: (json['upper'] as num?)?.toDouble(),
  value: (json['value'] as num?)?.toDouble(),
);

Map<String, dynamic> _$FrontendFigureToJson(FrontendFigure instance) => <String, dynamic>{
  'basis': _$SharedFigureBasisEnumMap[instance.basis]!,
  'decimals': ?instance.decimals,
  'fromYear': ?instance.fromYear,
  'indicator': instance.indicator,
  'label': instance.label,
  'lower': ?instance.lower,
  'status': _$SharedFigureStatusEnumMap[instance.status]!,
  'toYear': ?instance.toYear,
  'unit': ?instance.unit,
  'upper': ?instance.upper,
  'value': ?instance.value,
};

const _$SharedFigureBasisEnumMap = {
  SharedFigureBasis.aggregated: 'aggregated',
  SharedFigureBasis.estimated: 'estimated',
  SharedFigureBasis.measured: 'measured',
  SharedFigureBasis.modelled: 'modelled',
  SharedFigureBasis.projected: 'projected',
};

const _$SharedFigureStatusEnumMap = {
  SharedFigureStatus.estimated: 'estimated',
  SharedFigureStatus.finalValue: 'final',
  SharedFigureStatus.missing: 'missing',
  SharedFigureStatus.projected: 'projected',
  SharedFigureStatus.provisional: 'provisional',
  SharedFigureStatus.revised: 'revised',
  SharedFigureStatus.suppressed: 'suppressed',
};
