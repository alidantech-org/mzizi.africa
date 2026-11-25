// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'metrics.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsMetrics _$StatisticsMetricsFromJson(Map<String, dynamic> json) => StatisticsMetrics(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  denominatorId: json['denominatorId'] as String?,
  higherIsBetter: json['higherIsBetter'] as bool?,
  id: json['id'] as String,
  identityKind: $enumDecode(_$SharedIdentityKindEnumMap, json['identityKind']),
  isRankable: json['isRankable'] as bool,
  levelTerm: json['levelTerm'] as String?,
  numeratorId: json['numeratorId'] as String,
  perFactor: (json['perFactor'] as num?)?.toDouble(),
  topicTerm: json['topicTerm'] as String,
  unitId: json['unitId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$StatisticsMetricsToJson(StatisticsMetrics instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'denominatorId': ?instance.denominatorId,
  'higherIsBetter': ?instance.higherIsBetter,
  'id': instance.id,
  'identityKind': _$SharedIdentityKindEnumMap[instance.identityKind]!,
  'isRankable': instance.isRankable,
  'levelTerm': ?instance.levelTerm,
  'numeratorId': instance.numeratorId,
  'perFactor': ?instance.perFactor,
  'topicTerm': instance.topicTerm,
  'unitId': ?instance.unitId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$SharedIdentityKindEnumMap = {
  SharedIdentityKind.app: 'app',
  SharedIdentityKind.bill: 'bill',
  SharedIdentityKind.coalition: 'coalition',
  SharedIdentityKind.collection: 'collection',
  SharedIdentityKind.country: 'country',
  SharedIdentityKind.currency: 'currency',
  SharedIdentityKind.debt: 'debt',
  SharedIdentityKind.election: 'election',
  SharedIdentityKind.entity: 'entity',
  SharedIdentityKind.era: 'era',
  SharedIdentityKind.event: 'event',
  SharedIdentityKind.feature: 'feature',
  SharedIdentityKind.function: 'function',
  SharedIdentityKind.fund: 'fund',
  SharedIdentityKind.hierarchy: 'hierarchy',
  SharedIdentityKind.indicator: 'indicator',
  SharedIdentityKind.individual: 'individual',
  SharedIdentityKind.instrument: 'instrument',
  SharedIdentityKind.language: 'language',
  SharedIdentityKind.level: 'level',
  SharedIdentityKind.metric: 'metric',
  SharedIdentityKind.occurrence: 'occurrence',
  SharedIdentityKind.office: 'office',
  SharedIdentityKind.position: 'position',
  SharedIdentityKind.procedure: 'procedure',
  SharedIdentityKind.procurement: 'procurement',
  SharedIdentityKind.product: 'product',
  SharedIdentityKind.project: 'project',
  SharedIdentityKind.service: 'service',
  SharedIdentityKind.timezone: 'timezone',
  SharedIdentityKind.unit: 'unit',
};
