// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'base_query.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

BaseQuery _$BaseQueryFromJson(Map<String, dynamic> json) => BaseQuery(
  limit: (json['limit'] as num?)?.toInt(),
  order: $enumDecodeNullable(_$SortDirectionEnumMap, json['order']),
  page: (json['page'] as num?)?.toInt(),
  sort: json['sort'] as String?,
);

Map<String, dynamic> _$BaseQueryToJson(BaseQuery instance) => <String, dynamic>{
  'limit': ?instance.limit,
  'order': ?_$SortDirectionEnumMap[instance.order],
  'page': ?instance.page,
  'sort': ?instance.sort,
};

const _$SortDirectionEnumMap = {
  SortDirection.ascending: 'asc',
  SortDirection.descending: 'desc',
};
