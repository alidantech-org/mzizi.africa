import 'package:json_annotation/json_annotation.dart';

part 'pagination_meta.g.dart';

/// Pagination Meta
@JsonSerializable(includeIfNull: false)
class SharedPaginationMeta {
  const SharedPaginationMeta({required this.limit, required this.page, required this.total, required this.totalPages});
  final int limit;
  final int page;
  final int total;
  final int totalPages;

  factory SharedPaginationMeta.fromJson(Map<String, dynamic> json) => _$SharedPaginationMetaFromJson(json);

  Map<String, dynamic> toJson() => _$SharedPaginationMetaToJson(this);
}
