import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/sort_direction.dart';

part 'base_query.g.dart';

/// Base Query
@JsonSerializable(includeIfNull: false)
class SharedBaseQuery {
  const SharedBaseQuery({this.limit, this.order, this.page, this.sort});
  final int? limit;
  final SharedSortDirection? order;
  final int? page;
  final String? sort;

  factory SharedBaseQuery.fromJson(Map<String, dynamic> json) => _$SharedBaseQueryFromJson(json);

  Map<String, dynamic> toJson() => _$SharedBaseQueryToJson(this);
}
