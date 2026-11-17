// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'base_query.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SharedBaseQuery _$SharedBaseQueryFromJson(Map<String, dynamic> json) => SharedBaseQuery(
  limit: (json['limit'] as num?)?.toInt(),
  order: $enumDecodeNullable(_$SharedSortDirectionEnumMap, json['order']),
  page: (json['page'] as num?)?.toInt(),
  sort: json['sort'] as String?,
);

Map<String, dynamic> _$SharedBaseQueryToJson(SharedBaseQuery instance) => <String, dynamic>{
  'limit': ?instance.limit,
  'order': ?_$SharedSortDirectionEnumMap[instance.order],
  'page': ?instance.page,
  'sort': ?instance.sort,
};

const _$SharedSortDirectionEnumMap = {SharedSortDirection.ascending: 'asc', SharedSortDirection.descending: 'desc'};
