import 'package:json_annotation/json_annotation.dart';

part 'pagination_meta.g.dart';

/// Pagination Meta
@JsonSerializable(includeIfNull: false)
class PaginationMeta {
  const PaginationMeta({
    required this.limit,
    required this.page,
    required this.total,
    required this.totalPages,
  });
  final int limit;
  final int page;
  final int total;
  final int totalPages;

  factory PaginationMeta.fromJson(Map<String, dynamic> json) => _$PaginationMetaFromJson(json);

  Map<String, dynamic> toJson() => _$PaginationMetaToJson(this);
}