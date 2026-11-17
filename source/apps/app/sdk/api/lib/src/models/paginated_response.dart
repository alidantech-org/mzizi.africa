import 'package:json_annotation/json_annotation.dart';
import 'pagination_meta.dart';

part 'paginated_response.g.dart';

/// Paginated Response
@JsonSerializable(includeIfNull: false)
class PaginatedResponse {
  const PaginatedResponse({
    required this.meta,
  });
  final PaginationMeta meta;

  factory PaginatedResponse.fromJson(Map<String, dynamic> json) => _$PaginatedResponseFromJson(json);

  Map<String, dynamic> toJson() => _$PaginatedResponseToJson(this);
}