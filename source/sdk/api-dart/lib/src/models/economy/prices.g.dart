// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'prices.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EconomyPrices _$EconomyPricesFromJson(Map<String, dynamic> json) => EconomyPrices(
  amount: (json['amount'] as num?)?.toInt(),
  basis: $enumDecode(_$SharedFigureBasisEnumMap, json['basis']),
  collectionId: json['collectionId'] as String?,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  featureId: json['featureId'] as String?,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  goodId: json['goodId'] as String,
  id: json['id'] as String,
  kind: $enumDecode(_$EconomyPriceKindEnumMap, json['kind']),
  revision: (json['revision'] as num).toInt(),
  startsOn: json['startsOn'] == null ? null : DateTime.parse(json['startsOn'] as String),
  status: $enumDecode(_$SharedFigureStatusEnumMap, json['status']),
  supersedesId: json['supersedesId'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$EconomyPricesToJson(EconomyPrices instance) => <String, dynamic>{
  'amount': ?instance.amount,
  'basis': _$SharedFigureBasisEnumMap[instance.basis]!,
  'collectionId': ?instance.collectionId,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': instance.currencyId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'featureId': ?instance.featureId,
  'fromYear': ?instance.fromYear,
  'goodId': instance.goodId,
  'id': instance.id,
  'kind': _$EconomyPriceKindEnumMap[instance.kind]!,
  'revision': instance.revision,
  'startsOn': ?instance.startsOn?.toIso8601String(),
  'status': _$SharedFigureStatusEnumMap[instance.status]!,
  'supersedesId': ?instance.supersedesId,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$SharedFigureBasisEnumMap = {
  SharedFigureBasis.aggregated: 'aggregated',
  SharedFigureBasis.estimated: 'estimated',
  SharedFigureBasis.measured: 'measured',
  SharedFigureBasis.modelled: 'modelled',
  SharedFigureBasis.projected: 'projected',
};

const _$EconomyPriceKindEnumMap = {
  EconomyPriceKind.contract: 'contract',
  EconomyPriceKind.farmGate: 'farm-gate',
  EconomyPriceKind.modelled: 'modelled',
  EconomyPriceKind.retail: 'retail',
  EconomyPriceKind.standardCost: 'standard-cost',
  EconomyPriceKind.wholesale: 'wholesale',
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
