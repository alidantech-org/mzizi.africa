import 'package:json_annotation/json_annotation.dart';
import '../enums/sort_direction.dart';

part 'base_query.g.dart';

/// Base Query
@JsonSerializable(includeIfNull: false)
class BaseQuery {
  const BaseQuery({
    this.limit,
    this.order,
    this.page,
    this.sort,
  });
  final int? limit;
  final SortDirection? order;
  final int? page;
  final String? sort;

  factory BaseQuery.fromJson(Map<String, dynamic> json) => _$BaseQueryFromJson(json);

  Map<String, dynamic> toJson() => _$BaseQueryToJson(this);
}